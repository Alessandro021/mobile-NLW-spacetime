import { ScrollView, SafeAreaView, Text, TextInput, TouchableOpacity, View, Image, RefreshControl } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store"
import { api } from "../src/lib/api";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
dayjs.locale(ptBr)

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg"

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])

  async function singOut(){
    await SecureStore.deleteItemAsync("token")
    router.push("/")
  }

  async function loadMemories(){
    const token = await SecureStore.getItemAsync("token")

    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`
        }
    })

    setMemories(response.data)
  }

  useEffect( () => {
      loadMemories()
  }, [])


  return (
    <ScrollView className="flex-1 px-8" style={{ marginBottom: bottom, marginTop: top }}>
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        

        <View className="flex-row gap-2">
          <TouchableOpacity onPress={singOut} className="h-10 w-10 items-center justify-center rounded-full bg-red-500">
            <Icon name="log-out" size={16} color="#FFF" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>

      </View>

      {memories.map((memory) => (
        <View key={memory.id} className="mt-6 space-y-10">
        <View className="space-y-4">
          <View className="flex-row items-center gap-2">
            <View className="h-px w-5 bg-gray-50" />
            <Text className="font-body text-xs text-gray-100">{dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}</Text>
          </View>
          <View className="space-y-4 px-8">
            <Image 
            source={{uri: memory.coverUrl}} 
            className="aspect-video w-full rounded-lg"
            alt=""
            />

            <Text className="font-body text-base leading-relaxed text-gray-100 text-justify">
             {memory.excerpt}
            </Text>

            <Link href={{ pathname: 'viewMemory', params: { id: memory.id }} } asChild>
              <TouchableOpacity className="flex-row items-center gap-2">
                <Text className="font-body text-sm text-gray-200">Ler mais</Text>
                <Icon name="arrow-right" size={16} color="#9e9ea0" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
      ))}

    </ScrollView>
  )
}