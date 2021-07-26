import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import LoginApp from './app/index';


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
  


export default class App extends React.Component {
  constructor() {
  super();
  this.
  state = {
    isReady: false
  };
  }


  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require('./assets/wallpaper.jpg')]);
    await Promise.all([...imageAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <LoginApp />

    )



  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



// import * as React from 'react';
// import { View, Text, Image } from 'react-native';
// import AppLoading from 'expo-app-loading';
// import * as Font from 'expo-font';
// import { Asset } from 'expo-asset';
// import { FontAwesome } from '@expo/vector-icons';

// function cacheImages(images) {
//   return images.map(image => {
//     if (typeof image === 'string') {
//       return Image.prefetch(image);
//     } else {
//       return Asset.fromModule(image).downloadAsync();
//     }
//   });
// }

// function cacheFonts(fonts) {
//   return fonts.map(font => Font.loadAsync(font));
// }

// export default class AppContainer extends React.Component {
//   state = {
//     isReady: false,
//   };

//   async _loadAssetsAsync() {
//     const imageAssets = cacheImages([
//       'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
//       require('./assets/wallpaper.jpg'),
//     ]);

//     const fontAssets = cacheFonts([FontAwesome.font]);

//     await Promise.all([...imageAssets, ...fontAssets]);
//   }

//   render() {
//     if (!this.state.isReady) {
//       return (
//         <AppLoading
//           startAsync={this._loadAssetsAsync}
//           onFinish={() => this.setState({ isReady: true })}
//           onError={console.warn}
//         />
//       );
//     }

//     return (
//       <View>
//         <Text>Hello world, this is my app.</Text>
//       </View>
//     );
//   }
// }