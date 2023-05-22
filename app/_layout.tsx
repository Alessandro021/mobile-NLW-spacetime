import { styled } from "nativewind"
import { ImageBackground, StatusBar } from "react-native"
import { useFonts, Roboto_400Regular, Roboto_700Bold} from "@expo-google-fonts/roboto"
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree"
import * as SecureStore from "expo-secure-store"



import blurBg from "../src/assets/bg-blur.png"
import Stripes from "../src/assets/stripes.svg"
import { SplashScreen, Stack } from "expo-router"
import { useEffect, useState } from "react"


const StyledStripes = styled(Stripes)
export default function Layout(){
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<null | boolean>(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync("token")
    .then(token => {
      setIsUserAuthenticated(!!token)
    })
    .catch(error => console.log(error.message))
  },[])

  
  if(!hasLoadedFonts){
    return <SplashScreen />
  }
  return(
    <ImageBackground 
    source={blurBg} 
    className='bg-gray-900 flex-1 relative'
    imageStyle={{position: "absolute", left: "-100%"}}
    >
      <StatusBar barStyle='light-content' />
      <StyledStripes className='absolute left-2'/>

      <Stack  screenOptions={{headerShown: false, contentStyle: {backgroundColor: "transparent"}, animation: "slide_from_right" }}>
        <Stack.Screen name="index" redirect={isUserAuthenticated}/>
        <Stack.Screen name="memories"/>
        <Stack.Screen name="viewMemory"/>
        <Stack.Screen name="new"/>
      </Stack> 
      {/**REMOVE O READER DO TOPO E REMOVE A COR BRANCA PADRAO DO BACGROUD DA TELA */}
    </ImageBackground>
  )
}