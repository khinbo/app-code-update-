/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import * as Yup from 'yup';
import {AppForm, AppFormInput, AppHeader, SubmitButton} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import server from '../../server';
import helpers from '../../constants/helpers';

const inputfields = [
  {title: 'Email address', name: 'email', icon: icons.email},
];

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

export const ForgetPasswordScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const changePassword = values => {
    setLoading(true);
    server.sendOtp(values).then(resp => {
      setLoading(false);
      if (!resp.ok) {
        return helpers.apiResponseErrorHandler(resp);
      }
      setTimeout(() => {
        navigation.navigate('otp', {user: resp.data});
      }, 500);
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <AppHeader title={'Forget Password'} backButton />
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 25,
          }}>
          <Text
            style={{
              ...FONTS.h3,
              marginBottom: 20,
              color: COLORS.gray,
            }}>
            Enter your email
          </Text>
          <AppForm
            initialValues={{
              email: '',
            }}
            validationSchema={validationSchema}
            onSubmit={changePassword}>
            {inputfields.map(input => (
              <View style={input.name} key={input.name}>
                <AppFormInput
                  title={input.title}
                  icon={input.icon}
                  name={input.name}
                  isPassword={false}
                  secureTextEntry={
                    input.name === 'password' ||
                    input.name === 'password_confirmation'
                  }
                />
              </View>
            ))}
            <View
              style={{
                marginBottom: 20,
                marginTop: 5,
              }}>
              <SubmitButton title="Continue" loading={loading} />
            </View>
          </AppForm>
        </View>
      </View>
    </View>
  );
};
