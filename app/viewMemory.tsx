import { Link } from "expo-router";
import { ScrollView, StatusBar, Text, TouchableOpacity, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store"
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
dayjs.locale(ptBr)

import Icon from "@expo/vector-icons/Feather"

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg"
import { api } from "../src/lib/api";
import { useEffect, useState } from "react";

interface Memory {
    coverUrl: string
    content: string
    createdAt: string
    id: string
    userId: string
    isPublic: boolean
  }

export default function ViewMemory(){
    const { id } = useLocalSearchParams();
    const { bottom, top} = useSafeAreaInsets()
    const [memory, setMemory] = useState<Memory>({})

    async function getMemory(){
        const token = await SecureStore.getItemAsync("token")
        const {data} = await api.get(`/memories/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setMemory(data)
    }

    useEffect(() => {
        getMemory()
    },[])
    return(
        <ScrollView className="flex-1 p-8" style={{ marginBottom: bottom, marginTop: top  }}>
            <StatusBar barStyle='light-content' />
            <View className="mt-4 flex-row items-center justify-between">
                <NLWLogo />
                <Link href="/memories" asChild>
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                        <Icon name="arrow-left" size={16} color="#FFF" />
                    </TouchableOpacity>
                </Link>
            </View>

            <View className="mt-6 mb-12 space-y-10">
                <View className="space-y-4">
                    <View className="flex-row items-center"> 
                        <View className="h-px w-5 bg-gray-50" />
                        <Text className="font-body text-xs text-gray-100">{dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}</Text>
                    </View>
                    <View className="space-y-4 px-2">
                        <Image
                            source={{ uri: memory.coverUrl }}
                            className="aspect-video w-full rounded-lg"
                            alt=""
                        />

                        <Text className="font-body text-base leading-relaxed text-gray-100 text-justify">
                            {memory.content}
                        </Text>                   
                    </View>
                </View>
            </View>            
        </ScrollView>
    )
}