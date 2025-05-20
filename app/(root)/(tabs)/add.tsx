import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { ID } from "react-native-appwrite";
import { config, databases } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "@/lib/data";

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

const facilitiesList = ["Laundry", "Parking", "Gym", "Wifi", "Pet-friendly"];
const propertyTypes = [
  "House", "Townhouse", "Condo", "Duplex", "Studio", "Villa", "Apartment", "Other"
];

function getRandomSubset<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

const AddProperty = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("House");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [buildingSize, setBuildingSize] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(price))) newErrors.price = "Price must be a number";
    else if (Number(price) < 0) {
      newErrors.price = "Price cannot be negative";
    }
    if (!type.trim()) newErrors.type = "Property type is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!bedrooms.trim()) newErrors.bedrooms = "Bedrooms is required";
    else if (isNaN(Number(bedrooms))) newErrors.bedrooms = "Bedrooms must be a number";
    else if (Number(bedrooms) < 0) {
      newErrors.bedrooms = "Bedrooms cannot be negative";
    }
    if (!bathrooms.trim()) newErrors.bathrooms = "Bathrooms is required";
    else if (isNaN(Number(bathrooms))) newErrors.bathrooms = "Bathrooms must be a number";
    else if (Number(bathrooms) < 0) {
      newErrors.bathrooms = "Bathrooms cannot be negative";
    }
    if (!buildingSize.trim()) newErrors.buildingSize = "Building size is required";
    else if (isNaN(Number(buildingSize))) newErrors.buildingSize = "Building size must be a number";
    else if (Number(buildingSize) <= 0) {
      newErrors.buildingSize = "Building size cannot be negative or zero";
    }
    if (!description.trim()) newErrors.description = "Description is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(phone)) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const agents = await databases.listDocuments(
        config.databaseId!,
        COLLECTIONS.AGENT!
      );
      const reviews = await databases.listDocuments(
        config.databaseId!,
        COLLECTIONS.REVIEWS!
      );
      const galleries = await databases.listDocuments(
        config.databaseId!,
        COLLECTIONS.GALLERY!
      );

      const selectedAgent = agents.documents[Math.floor(Math.random() * agents.documents.length)];
      const selectedReviews = getRandomSubset(reviews.documents, 5, 7).map((r) => r.$id);
      const selectedGalleries = getRandomSubset(galleries.documents, 3, 8).map((g) => g.$id);
const selectedImage = propertiesImages[Math.floor(Math.random() * propertiesImages.length)];

      await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        ID.unique(),
        {
          name: title,
          price: Number(price),
          description,
          type,
          address: location,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          area: Number(buildingSize),
          rating: 4.5,
          facilities: selectedFacilities,
          image: selectedImage,
          geolocation: "40.7128,-74.0060",
          agent: selectedAgent.$id,
          reviews: selectedReviews,
          gallery: selectedGalleries,
          email,
          phone,
        }
      );

      Alert.alert("Success", "Property added successfully");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add property");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 120, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#fff" }} // or use bg-white in className
    >
      {/* Header */}
      <View className="flex flex-row items-center justify-between mb-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
        >
          <Image source={icons.backArrow} className="size-5" />
        </TouchableOpacity>
        <Text className="text-base mr-2 font-rubik-medium text-black-300">
          Add New Property
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Title */}
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.title && <Text className="text-red-500 mb-2">{errors.title}</Text>}

      {/* Price */}
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.price && <Text className="text-red-500 mb-2">{errors.price}</Text>}

      {/* Description */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.description && (
        <Text className="text-red-500 mb-2">{errors.description}</Text>
      )}

      {/* Property Type */}
      <Text className="mb-1 font-bold">Property Type</Text>
      <View className="flex flex-row flex-wrap mb-4">
        {propertyTypes.map((pt) => (
          <TouchableOpacity
            key={pt}
            onPress={() => setType(pt)}
            className={`mr-4 mb-2 px-4 py-2 rounded-full border flex-row items-center ${
              type === pt ? "border-primary-500 bg-primary-200" : "border-gray-300"
            }`}
          >
            <View
              style={{
                width: 18,
                height: 18,
                marginRight: 8,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: type === pt ? "#3B82F6" : "#D1D5DB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {type === pt && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#3B82F6",
                  }}
                />
              )}
            </View>
            <Text
              style={{
                color: type === pt ? "#2563EB" : "#374151",
                fontWeight: type === pt ? "700" : "400",
              }}
            >
              {pt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.type && <Text className="text-red-500 mb-2">{errors.type}</Text>}

      {/* Location */}
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.location && (
        <Text className="text-red-500 mb-2">{errors.location}</Text>
      )}

      {/* Bedrooms */}
      <TextInput
        placeholder="Bedrooms"
        value={bedrooms}
        onChangeText={setBedrooms}
        keyboardType="numeric"
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.bedrooms && (
        <Text className="text-red-500 mb-2">{errors.bedrooms}</Text>
      )}

      {/* Bathrooms */}
      <TextInput
        placeholder="Bathrooms"
        value={bathrooms}
        onChangeText={setBathrooms}
        keyboardType="numeric"
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.bathrooms && (
        <Text className="text-red-500 mb-2">{errors.bathrooms}</Text>
      )}

      {/* Building Size */}
      <TextInput
        placeholder="Building Size (sq ft)"
        value={buildingSize}
        onChangeText={setBuildingSize}
        keyboardType="numeric"
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.buildingSize && (
        <Text className="text-red-500 mb-2">{errors.buildingSize}</Text>
      )}

      {/* Facilities Checkboxes */}
      <Text className="mb-2 font-bold">Select Facilities</Text>
      <View className="flex flex-row flex-wrap mb-4">
        {facilitiesList.map((facility) => {
          const isSelected = selectedFacilities.includes(facility);
          return (
            <TouchableOpacity
              key={facility}
              onPress={() => toggleFacility(facility)}
              className={`flex-row items-center px-4 py-2 mb-2 mr-2 rounded-full border ${
                isSelected ? "bg-primary-200 border-primary-500" : "border-gray-300"
              }`}
            >
              <View
                className={`w-4 h-4 mr-2 rounded-sm border ${
                  isSelected ? "bg-primary-500 border-primary-500" : "border-gray-400"
                }`}
              />
              <Text className={isSelected ? "text-primary-700" : "text-gray-700"}>
                {facility}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        placeholder="Contact Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.email && <Text className="text-red-500 mb-2">{errors.email}</Text>}

      {/* Phone */}
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="mb-1 border p-3 rounded-lg border-gray-300"
      />
      {errors.phone && <Text className="text-red-500 mb-2">{errors.phone}</Text>}

      {/* Submit Button */}
      <Button title="Add Property" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default AddProperty;
