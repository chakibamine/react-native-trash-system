import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

// Styled components
const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  flex: 1;
`;

const FormContainer = styled.ScrollView<ThemeProps>`
  flex: 1;
  padding: 16px;
`;

const InputContainer = styled.View<ThemeProps>`
  margin-bottom: 16px;
`;

const Label = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const Input = styled.TextInput<ThemeProps>`
  height: 48px;
  padding: 12px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const SelectContainer = styled.View<ThemeProps>`
  height: 48px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  overflow: hidden;
`;

const SwitchContainer = styled.View<ThemeProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  margin-bottom: 16px;
`;

const SwitchLabel = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const SubmitButton = styled.TouchableOpacity<ThemeProps>`
  height: 48px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const SubmitButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

interface Driver {
  id: string;
  name: string;
}

enum GarbageTruckStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE'
}

interface FormData {
  licenseNumber: string;
  vehicleId: string;
  isAvailable: boolean;
  status: GarbageTruckStatus;
  driverId: string;
}

export default function EditTruckScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<FormData>({
    licenseNumber: '',
    vehicleId: '',
    isAvailable: true,
    status: GarbageTruckStatus.ACTIVE,
    driverId: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [drivers] = useState<Driver[]>([
    { id: 'DRV-001', name: 'John Doe' },
    { id: 'DRV-002', name: 'Jane Smith' },
    { id: 'DRV-003', name: 'Mike Johnson' },
    { id: 'DRV-004', name: 'Sarah Williams' },
  ]);

  useEffect(() => {
    fetchTruckData();
  }, [id]);

  const fetchTruckData = async () => {
    try {
      // Here you would make an API call to fetch the truck data
      // For now, we'll simulate it with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData: FormData = {
        licenseNumber: 'TRK-001',
        vehicleId: 'VH-001',
        isAvailable: true,
        status: GarbageTruckStatus.ACTIVE,
        driverId: 'DRV-001',
      };
      setForm(mockData);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch truck data');
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would make an API call to update the truck
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Truck updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update truck');
    }
  };

  if (isLoading) {
    return (
      <Container style={{ paddingTop: insets.top }}>
        <Header>
          <BackButton onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </BackButton>
          <Title>Edit Truck</Title>
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </BackButton>
        <Title>Edit Truck</Title>
      </Header>

      <FormContainer>
        <InputContainer>
          <Label>License Number</Label>
          <Input
            value={form.licenseNumber}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, licenseNumber: text }))}
            placeholder="Enter license number"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </InputContainer>

        <InputContainer>
          <Label>Vehicle ID</Label>
          <Input
            value={form.vehicleId}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, vehicleId: text }))}
            placeholder="Enter vehicle ID"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </InputContainer>

        <InputContainer>
          <Label>Status</Label>
          <SelectContainer>
            <Picker
              selectedValue={form.status}
              onValueChange={(value: GarbageTruckStatus) => setForm(prev => ({ ...prev, status: value }))}
              style={{ color: theme.colors.text.primary }}
            >
              <Picker.Item label="Active" value={GarbageTruckStatus.ACTIVE} />
              <Picker.Item label="Maintenance" value={GarbageTruckStatus.MAINTENANCE} />
              <Picker.Item label="Inactive" value={GarbageTruckStatus.INACTIVE} />
            </Picker>
          </SelectContainer>
        </InputContainer>

        <InputContainer>
          <Label>Driver</Label>
          <SelectContainer>
            <Picker
              selectedValue={form.driverId}
              onValueChange={(value: string) => setForm(prev => ({ ...prev, driverId: value }))}
              style={{ color: theme.colors.text.primary }}
            >
              <Picker.Item label="Select a driver" value="" />
              {drivers.map((driver) => (
                <Picker.Item 
                  key={driver.id} 
                  label={driver.name} 
                  value={driver.id} 
                />
              ))}
            </Picker>
          </SelectContainer>
        </InputContainer>

        <SwitchContainer>
          <SwitchLabel>Available</SwitchLabel>
          <Switch
            value={form.isAvailable}
            onValueChange={(value: boolean) => setForm(prev => ({ ...prev, isAvailable: value }))}
          />
        </SwitchContainer>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Update Truck</SubmitButtonText>
        </SubmitButton>
      </FormContainer>
    </Container>
  );
} 