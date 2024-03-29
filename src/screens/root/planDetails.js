/* eslint-disable curly */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View, StyleSheet, Alert, Platform} from 'react-native';
import {AppButton, AppHeader, Appicon, BaseView} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../I18n';
import server from '../../server';
import AuthContext from '../../store/AuthContext';

export const PlanDetailsScreen = ({navigation, route}) => {
  const {user, trigger} = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const {item} = route.params;

  const package_id = user?.is_subscribed?.subscribe?.package_id;

  return (
    <>
      <AppHeader title={item.name.toUpperCase()} backButton shadow={false} />
      <BaseView styles={styles.wrapper} loading={false}>
        <View style={styles.card}>
          <Text style={{...FONTS.h3, color: COLORS.black}}>{item?.name}</Text>
          {!item?.is_free ? (
            <Text style={{...FONTS.body4, fontSize: 12, color: COLORS.gray}}>
              {item?.days + ' days'}
            </Text>
          ) : null}

          <Text style={{...FONTS.body4, color: COLORS.gray}}>
            {item?.subtitle}
          </Text>
          <Text
            style={{...FONTS.h1, marginVertical: 10, color: COLORS.primary}}>
            € {item?.price}
          </Text>
          {item?.row_1 ? (
            <View style={styles.row}>
              <Appicon icon={icons.tick} size={15} color={COLORS.primary} />
              <Text style={{...FONTS.body4, marginLeft: 5, color: COLORS.gray}}>
                {item?.row_1}
              </Text>
            </View>
          ) : null}
          {item?.row_2 ? (
            <View style={styles.row}>
              <Appicon icon={icons.tick} size={15} color={COLORS.primary} />
              <Text style={{...FONTS.body4, marginLeft: 5, color: COLORS.gray}}>
                {item?.row_2}
              </Text>
            </View>
          ) : null}
          {item?.row_3 ? (
            <View style={styles.row}>
              <Appicon icon={icons.tick} size={15} color={COLORS.primary} />
              <Text style={{...FONTS.body4, marginLeft: 5, color: COLORS.gray}}>
                {item?.row_3}
              </Text>
            </View>
          ) : null}
          {item?.row_4 ? (
            <View style={styles.row}>
              <Appicon icon={icons.tick} size={15} color={COLORS.primary} />
              <Text style={{...FONTS.body4, marginLeft: 5, color: COLORS.gray}}>
                {item?.row_4}
              </Text>
            </View>
          ) : null}
          {item?.row_5 ? (
            <View style={styles.row}>
              <Appicon icon={icons.tick} size={15} color={COLORS.primary} />
              <Text style={{...FONTS.body4, marginLeft: 5, color: COLORS.gray}}>
                {item?.row_5}
              </Text>
            </View>
          ) : null}
          <View style={{marginTop: 20}}>
            <AppButton
              loading={load}
              onPress={() => {
                if (item?.is_free) {
                  setLoad(true);
                  server.subscribePackage(item?.id).then(resp => {
                    setLoad(false);
                    if (!resp.ok)
                      return Alert.alert(
                        'Payment  error',
                        error?.message ? error.message : '',
                      );
                    trigger.signin(resp.data);
                    setTimeout(() => {
                      navigation.goBack();
                    }, 300);
                  });
                } else {
                  // if (user?.is_subscribed && item.days < 31)
                  //   return Alert.alert(
                  //     translate('unableToSwitch'),
                  //     translate('notPossibleToSwitchFromAnnualToMonthly'),
                  //     [
                  //       {
                  //         text: translate('cancel'),
                  //         onPress: () => {},
                  //       },
                  //       {
                  //         text: translate('goBack'),
                  //         onPress: () => navigation.goBack(),
                  //         style: 'destructive',
                  //       },
                  //     ],
                  //   );
                  if (Platform.OS === 'ios') {
                    navigation.navigate('inAppPurchase', {plan: item});
                  } else {
                    navigation.navigate('payment', {plan: item});
                  }
                }
              }}
              radius={50}
              title="Subscribe"
              disable={package_id === item?.id}
            />
          </View>
        </View>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    shadowColor: '#000',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
