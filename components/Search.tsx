import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  Modal,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import icons from "@/constants/icons";
import { useLocalSearchParams, router } from "expo-router";

const Search = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query ?? "");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleSubmit = () => {
    router.setParams({ query: search });
    Keyboard.dismiss();
  };

  return (
    <>
      <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
        <View className="flex-1 flex flex-row items-center justify-start z-50">
          <Image source={icons.search} className="size-5" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search for anything"
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            className="text-sm font-rubik text-black-300 ml-2 flex-1"
          />
        </View>

        <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
          <Image source={icons.filter} className="size-5" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl px-5 pt-6 pb-10">
            <Text className="text-lg font-bold mb-4">Filter</Text>
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Example filter fields */}
              <Text className="font-medium mb-2">Price Range</Text>
              <View className="flex-row justify-between mb-4">
                <TextInput
                  placeholder="Min"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                />
                <TextInput
                  placeholder="Max"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg p-2 flex-1 ml-2"
                />
              </View>

              <Text className="font-medium mb-2">Bedrooms</Text>
              <TextInput
                placeholder="e.g. 2"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg p-2 mb-4"
              />

              <Text className="font-medium mb-2">Bathrooms</Text>
              <TextInput
                placeholder="e.g. 1"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg p-2 mb-4"
              />

              {/* Buttons */}
              <View className="flex-row justify-between mt-6">
                <Pressable
                  onPress={() => setIsFilterVisible(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    // handle filter apply logic here
                    setIsFilterVisible(false);
                  }}
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white">Apply</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Search;
