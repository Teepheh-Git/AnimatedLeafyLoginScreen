import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Svg, { Image, Circle, ClipPath } from 'react-native-svg';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window')

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  concat,
  Extrapolate
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
class LoginApp extends Component {
  constructor() {
    super();
    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);

    this.onCloseStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            )
          ])
      }
    ]);


    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [(-height / 3) - 50, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.textInputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP
    });
    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP
    });
    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP
    });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-end'
        }}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }]
          }}
        >
          <Svg height={height + 50} width={width}>

            <ClipPath id='clip'>
              <Circle r={height + 50} cx={width / 2} />
            </ClipPath>


            <Image
              href={require('../assets/wallpaper.jpg')}
              height={height + 50}
              width={width}
              preserveAspectRatio="xMidyMid slice"
              clipPath="url(#clip)"
            />
          </Svg>

        </Animated.View>
        <View style={{ height: height / 3, justifyContent: 'center' }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#B7131E' }}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View
            style={{
              ...styles.button,
              backgroundColor: '#2E71DC',
              opacity: this.buttonOpacity,
              transform: [{ translateY: this.buttonY }]
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              SIGN IN WITH FACEBOOK
            </Text>
          </Animated.View>

          <Animated.View style={{
            zIndex: this.textInputZindex,
            opacity: this.textInputOpacity,
            height: height / 3,
            transform: [{ translateY: this.textInputY }],
            ...StyleSheet.absoluteFill,
            top: null,
            justifyContent: 'center'
          }}>

            <TapGestureHandler onHandlerStateChange={this.onCloseStateChange}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text style={{ fontSize: 15, color: '#B7131E', transform: [{ rotate: concat(this.rotateCross, 'deg') }] }}>X</Animated.Text>
              </Animated.View>
            </TapGestureHandler>

            <TextInput
              placeholder="EMAIL"
              style={styles.textInput}
              placeholderTextColor="black"
            />
            <TextInput
              placeholder="PASSWORD"
              style={styles.textInput}
              placeholderTextColor="black"
            />

            <Animated.View style={styles.button}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#B7131E' }}> SIGN IN</Text>

            </Animated.View>
          </Animated.View>



        </View>
      </View>
    );
  }
}
export default LoginApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#FFFFFF',
    height: 70,
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#B7131E',
    shadowOpacity: 0.2
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#B7131E',
    shadowOpacity: 0.2
  },
  textInput: {
    height: 50,
    borderRadius: 15,
    borderWidth: 0.5,
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 5,
    borderColor: '#B7131E'
  }
});
