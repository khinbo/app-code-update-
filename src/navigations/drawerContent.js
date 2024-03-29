/* eslint-disable react-native/no-inline-styles */
import {DrawerContentScrollView} from '@react-navigation/drawer';
import React, {useContext, useEffect, useState} from 'react';
import {ifIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  Platform,
} from 'react-native';
import Share from 'react-native-share';

import icons from '../constants/icons';
import images from '../constants/images';
import {COLORS, FONTS} from '../constants/theme';
import AuthContext from '../store/AuthContext';
import {Appicon} from '../components';
import helpers from '../constants/helpers';
import localStorage from '../server/localStorage';
import {changeLanguage, setLanguage} from '../I18n';
import DevelopedByKarimApps from '../components/base/DevelopedByKarimApps';

const menu_items = [
  {
    // title: 'Home',
    title: 'Accueil',
    frTitle: 'Accueil',
    icon: 'home',
    route: 'main',
  },
  {
    title: 'Profil',
    // title: 'Profile',
    frTitle: 'Profil',
    icon: 'user',
    route: 'profile',
  },
  {
    title: 'Plans',
    frTitle: 'Plans',
    icon: 'planning',
    route: 'plans',
  },
  {
    title: 'Share App',
    frTitle: 'Partager',
    icon: 'share',
    route: 'share',
  },
  {
    // title: 'Change password',
    title: 'Changer le mot de passe',
    frTitle: 'Changer le mot de passe',
    icon: 'password',
    route: 'password',
  },
  // {
  //   title: 'Notifications',
  //   frTitle: 'Avis',
  //   icon: 'bell',
  //   route: 'notification',
  // },
  // {title: 'Invoices', frTitle: 'Factures', icon: 'invoice', route: 'invoices'},
  // {title: 'Privacy', frTitle: 'Intimité', icon: 'privacy', route: 'privacy'},
  {title: 'Sign out', frTitle: 'Déconnexion', icon: 'logout', route: 'signout'},
];

const SwitchLangButtons = ({onPress, activeLang}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        width: 160,
        borderRadius: 80,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      }}>
      <Pressable
        android_ripple={{color: COLORS.primary}}
        onPress={() => onPress('en')}
        style={({pressed}) => [
          {
            opacity: pressed ? (Platform.OS === 'ios' ? 0.7 : 1) : 1,
          },
          {
            paddingVertical: 5,
            borderTopLeftRadius: 40,
            borderBottomLeftRadius: 40,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            width: 80,
            justifyContent: 'center',
            backgroundColor:
              activeLang === 'en' ? COLORS.primary : COLORS.white,
          },
        ]}>
        <Text
          style={{
            ...FONTS.h4,
            fontSize: 12,
            color: activeLang === 'en' ? COLORS.white : COLORS.black,
          }}>
          {activeLang === 'en' ? 'English' : 'Anglais'}
        </Text>
      </Pressable>
      <Pressable
        android_ripple={{color: COLORS.primary}}
        onPress={() => onPress('fr')}
        style={({pressed}) => [
          {
            opacity: pressed ? (Platform.OS === 'ios' ? 0.7 : 1) : 1,
          },
          {
            paddingVertical: 5,
            borderTopRightRadius: 40,
            borderBottomRightRadius: 40,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            width: 80,
            justifyContent: 'center',
            backgroundColor:
              activeLang === 'fr' ? COLORS.primary : COLORS.white,
          },
        ]}>
        <Text
          style={{
            ...FONTS.h4,
            fontSize: 12,
            color: activeLang === 'fr' ? COLORS.white : COLORS.black,
          }}>
          {activeLang === 'en' ? 'French' : 'Français'}
        </Text>
      </Pressable>
    </View>
  );
};

export const DrawerContent = props => {
  const [activeRoute, setActiveRoute] = useState('main');
  const {trigger, user} = useContext(AuthContext);
  const [activeLang, setActiveLang] = useState('');

  useEffect(() => {
    localStorage.getLang().then(resp => setActiveLang(resp ? resp : 'en'));
  }, []);

  const handleLanguage = async lang => {
    changeLanguage(lang);
    setLanguage('fr');
    setActiveLang(lang);
    await localStorage.saveLang(lang);
    //   if (lang === 'en') {
    //     AsyncStorage.removeItem('AppLocal')
    //   }else{
    //   AsyncStorage.setItem('AppLocal', 'fr').then(() => {
    //     setLanguage('fr')
    //   })
    // }
    console.log('language is ::::::', lang);
  };

  const renderAccountinfo = () => {
    return (
      <ImageBackground
        source={images.drawerbg}
        style={{
          width: '100%',
          height: 200,
          ...ifIphoneX(
            {
              marginTop: -55,
            },
            {
              marginTop: -5,
            },
          ),
          backgroundColor: COLORS.primary,
        }}>
        <View
          style={{
            padding: 20,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <Image
            source={{uri: helpers.getImage(user?.dp)}}
            style={{height: 80, width: 80, borderRadius: 40}}
          />
          <View style={{marginTop: 10}}>
            <Text style={{color: COLORS.white, ...FONTS.h2}}>{user?.name}</Text>
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.body5,
                lineHeight: 15,
                fontSize: 11,
              }}>
              {user?.email}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  };
  const renderMenuItem = props => {
    return menu_items.map(menu => (
      <Pressable
        android_ripple={{color: COLORS.primary}}
        onPress={async () => {
          if (menu.route === 'signout') {
            trigger.signout();
            return;
          }
          if (menu.route === 'share') {
            try {
              const title = 'Khinbo';
              const message = `Check out this app "${title}" on ${
                Platform.OS === 'android' ? 'Google Play Store' : 'App Store'
              }!`;
              const url =
                Platform.OS === 'android'
                  ? 'https://play.google.com/store/apps/details?id=com.Khinbo.app'
                  : 'https://apps.apple.com/us/app/khinbo/id6445998171';
              const options = {
                url: url,
                title: title,
                message: message,
              };
              const result = await Share.open(options);
              if (result.action === Share.sharedAction) {
                console.log('App link shared successfully');
              } else if (result.action === Share.dismissedAction) {
                console.log('App link sharing dismissed');
              }
            } catch (error) {
              console.log(error.message);
            }
            return;
          }
          setActiveRoute(menu.route);
          props.navigation.navigate(menu.route);
        }}
        key={menu.title}
        style={({pressed}) => [
          {
            opacity: pressed ? (Platform.OS === 'ios' ? 0.7 : 1) : 1,
          },
          {
            padding: 10,
            borderRadius: 4,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,

            backgroundColor: COLORS.white,
          },
        ]}>
        <Appicon
          icon={icons[menu.icon]}
          size={20}
          color={
            activeRoute === menu.route ? COLORS.primary : 'rgba(0,0,0,0.3)'
          }
        />

        <Text
          style={{
            flex: 1,
            marginLeft: 15,
            ...FONTS.h4,
            color:
              activeRoute === menu.route ? COLORS.primary : 'rgba(0,0,0,0.7)',
          }}>
          {activeLang === 'en' ? menu.title : menu.frTitle}
        </Text>
      </Pressable>
    ));
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        style={{
          backgroundColor: COLORS.white,
        }}>
        {renderAccountinfo()}
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 15,
          }}>
          {renderMenuItem(props)}
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          marginHorizontal: 5,
          marginBottom: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: Platform.select({
            android: 0,
            ios: 30,
          }),
        }}>
        <SwitchLangButtons
          activeLang={activeLang}
          onPress={lang => handleLanguage(lang)}
        />
        <DevelopedByKarimApps />
      </View>
    </View>
  );
};
