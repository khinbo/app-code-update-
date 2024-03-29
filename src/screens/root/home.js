/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Carousel from 'react-native-reanimated-carousel';
import {
  AppHeader,
  AppMovieCard,
  AppTitle,
  BaseView,
  PaginationItem,
} from '../../components';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import {translate} from '../../I18n';
import {getHomeData, setRefresh} from '../../store/reducers/home';
import AuthContext from '../../store/AuthContext';
import {useSharedValue} from 'react-native-reanimated';
import helpers from '../../constants/helpers';
import {onContentViewHandler} from '../../store/reducers/player';

const PAGE_WIDTH = SIZES.width;
export const Home = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {
    initialLoading,
    refresh,
    images,
    sliderData,
    recentlyWatched,
    mightInterestedContent,
    justForYou,
    popular,
  } = useSelector(state => state.home);
  useEffect(() => {
    dispatch(getHomeData());
  }, []);

  const progressValue = useSharedValue(0);

  return (
    <>
      <AppHeader title={translate('home')} />
      <BaseView styles={styles.container} loading={initialLoading}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            paddingBottom: SIZES.tab_bar_height,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                dispatch(setRefresh(true));
                dispatch(getHomeData());
              }}
            />
          }>
          <Carousel
            loop
            width={PAGE_WIDTH}
            height={200}
            data={images}
            pagingEnabled
            snapEnabled
            autoPlay
            autoPlayInterval={2500}
            onProgressChange={(_, absoluteProgress) =>
              (progressValue.value = absoluteProgress)
            }
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            renderItem={({item, index}) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  const movie = sliderData[index];
                  if (!helpers.isValid(user)) {
                    navigation.navigate('plans');
                  } else {
                    movie?.video_url
                      ? dispatch(
                          onContentViewHandler({item: movie, type: 'demands'}),
                        )
                      : navigation.navigate('artDetails', {
                          art: movie,
                          color: COLORS.primary,
                        });
                  }
                }}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 20,
                  backgroundColor: COLORS.lightGray,
                }}>
                <Image
                  style={{height: '100%', width: '100%', borderRadius: 20}}
                  source={{uri: item}}
                />
              </TouchableOpacity>
            )}
          />
          {!!progressValue && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 100,
                alignSelf: 'center',
              }}>
              {images.map((backgroundColor, index) => {
                return (
                  <PaginationItem
                    backgroundColor={backgroundColor}
                    animValue={progressValue}
                    index={index}
                    key={index}
                    isRotate={false}
                    length={images.length}
                  />
                );
              })}
            </View>
          )}

          {recentlyWatched.length ? (
            <View style={styles.movieContainer}>
              <AppTitle title={translate('recentlyWatched')} />
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={recentlyWatched}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <AppMovieCard movie={item} />}
              />
            </View>
          ) : null}
          {justForYou.length ? (
            <View style={styles.movieContainer}>
              <AppTitle title={translate('justForYou')} />
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={justForYou}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <AppMovieCard movie={item} />}
              />
            </View>
          ) : null}
          {popular.length ? (
            <View style={styles.movieContainer}>
              <AppTitle
                //  ${user.country?.name}
                title={`${translate('popularVideosIn')}`}
              />
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={popular}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <AppMovieCard movie={item} />}
              />
            </View>
          ) : null}
          {mightInterestedContent.length ? (
            <View style={styles.movieContainer}>
              <AppTitle title={translate('contentsYouMightBeInterested')} />
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={mightInterestedContent}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <AppMovieCard movie={item} />}
              />
            </View>
          ) : null}
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  movieContainer: {
    marginVertical: 5,
    paddingLeft: 15,
  },
  titleContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 99,
    backgroundColor: 'rgba(31, 100, 109, 0.6)',
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderTitle: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.white,
    fontStyle: 'italic',
  },
});
