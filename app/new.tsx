import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { api } from "../src/lib/api";
import * as SecureStore from "expo-secure-store"

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg"

export default function NewMemory(){
  const { bottom, top} = useSafeAreaInsets()

  const [isPublic, setIsPublic] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [content, setContent] = useState("")

  const router = useRouter()

  async function openImagePicker(){
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })
      if(result.assets[0]){
        setPreview(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error.message)
    }

  }

  async function handleCreateMemory(){
    const token = await SecureStore.getItemAsync("token")

    let coverUrl = ""

    if(preview){
      const uploadFormData = new FormData()

      uploadFormData.append("file", {
        uri: preview,
        name: "image.jpg",
        type: "image/jpeg",
      } as any)

      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      coverUrl = uploadResponse.data.fileUrl
    }

      await api.post("/memories", {
        content,
        isPublic,
        coverUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      router.push("/memories")
  }
  return (
    <ScrollView className="flex-1 p-8" style={{paddingBottom: bottom, paddingTop: top}}>
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
              <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
            <Switch 
            value={isPublic} 
            onValueChange={setIsPublic}
            trackColor={{false: "#767577", true: "#372560"}}
            thumbColor={isPublic ? "#9b79ea" : "#9e9ea0"}
            />
            <Text className="font-body text-base text-gray-200">
              Tornar memória púbica
            </Text>
        </View>

        <TouchableOpacity onPress={openImagePicker} activeOpacity={0.7} className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20">
          {preview ? 
          (
          <Image source={{uri: preview}} className="h-full w-full rounded-lg object-cover" />
          ) 
          : 
          (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color={"#FFF"} size={16} />
              <Text className=" font-body text-sm text-gray-200">
                Adicionar foto ou video de capa
              </Text>
          </View>
          )
          }
        </TouchableOpacity>

      <TextInput 
      multiline
      className="p-0 font-body text-lg text-gray-50"
      placeholderTextColor={"#56565a"}
      placeholder="Fique livre para adicionar fotos, videos e relatos sobre essa experiencia que você quer lembrar para sempre."
      value={content}
      onChangeText={text => setContent(text)}
      />

      <TouchableOpacity
        onPress={handleCreateMemory}
        activeOpacity={0.7}
        className='rounded-full items-center bg-green-500 px-5 py-2 mb-16'
      >
        <Text className='font-alt text-sm uppercase text-black'>SALVAR</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  )
}