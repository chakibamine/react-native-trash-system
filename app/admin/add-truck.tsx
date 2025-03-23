import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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

const FormContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const FormGroup = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text<ThemeProps>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const Input = styled.TextInput<ThemeProps>`
  height: 48px;
  padding: 0 16px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const SelectContainer = styled.TouchableOpacity<ThemeProps>`
  height: 48px;
  padding: 0 16px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PickerContainer = styled.View<ThemeProps>`
  height: 48px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  overflow: hidden;
`;

const SelectText = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const SubmitButton = styled.TouchableOpacity<ThemeProps>`
  height: 48px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const SubmitButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
`;

interface Driver {
  id: string;
  name: string;
}

interface TruckForm {
  licenseNumber: string;
  vehicleId: string;
  isAvailable: boolean;
  status: string;
  driverId: string;
}

export default function AddTruckScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<TruckForm>({
    licenseNumber: '',
    vehicleId: '',
    isAvailable: true,
    status: 'active',
    driverId: ''
  });
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [drivers] = useState<Driver[]>([
    { id: 'DRV-001', name: 'John Doe' },
    { id: 'DRV-002', name: 'Jane Smith' },
    { id: 'DRV-003', name: 'Mike Johnson' },
    { id: 'DRV-004', name: 'Sarah Williams' },
  ]);

  const handleSubmit = () => {
    // Validate form
    if (!form.licenseNumber || !form.vehicleId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically make an API call to create the truck
    Alert.alert(
      'Success',
      'Truck added successfully',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Inactive', value: 'inactive' }
  ];

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
        <Title>Add New Truck</Title>
      </Header>

      <FormContainer>
        <FormGroup>
          <Label>License Number *</Label>
          <Input
            placeholder="Enter license number"
            placeholderTextColor={theme.colors.text.secondary}
            value={form.licenseNumber}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, licenseNumber: text }))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Vehicle ID *</Label>
          <Input
            placeholder="Enter vehicle ID"
            placeholderTextColor={theme.colors.text.secondary}
            value={form.vehicleId}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, vehicleId: text }))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <SelectContainer onPress={() => setShowStatusPicker(true)}>
            <SelectText>
              {statusOptions.find(option => option.value === form.status)?.label}
            </SelectText>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.text.secondary}
            />
          </SelectContainer>
        </FormGroup>

        <FormGroup>
          <Label>Driver</Label>
          <PickerContainer>
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
          </PickerContainer>
        </FormGroup>

        <FormGroup>
          <Label>Availability</Label>
          <SelectContainer onPress={() => setForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}>
            <SelectText>
              {form.isAvailable ? 'Available' : 'Not Available'}
            </SelectText>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.text.secondary}
            />
          </SelectContainer>
        </FormGroup>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Add Truck</SubmitButtonText>
        </SubmitButton>
      </FormContainer>
    </Container>
  );
} 