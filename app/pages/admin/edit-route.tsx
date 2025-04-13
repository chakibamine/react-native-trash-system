import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, View, FlatList, ActivityIndicator } from 'react-native';
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

const PickerContainer = styled.View<ThemeProps>`
  height: 48px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  overflow: hidden;
`;

const BinSelectionContainer = styled.View<ThemeProps>`
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  padding: 8px 16px;
  margin-bottom: 16px;
`;

const BinItem = styled.View<ThemeProps & { selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border + '40'};
  background-color: ${(props: ThemeProps & { selected: boolean }) => props.selected ? props.theme.colors.primary + '10' : 'transparent'};
`;

const BinCheckbox = styled.TouchableOpacity<ThemeProps & { selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border-width: 2px;
  border-color: ${(props: ThemeProps & { selected: boolean }) => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${(props: ThemeProps & { selected: boolean }) => props.selected ? props.theme.colors.primary : 'transparent'};
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const BinInfo = styled.View`
  flex: 1;
`;

const BinName = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-weight: 500;
`;

const BinLocation = styled.Text<ThemeProps>`
  font-size: 12px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
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

interface Truck {
  id: string;
  name: string;
}

interface Bin {
  id: string;
  name: string;
  location: string;
}

interface RouteForm {
  routeName: string;
  assignedTruckId: string;
  assignedDriverId: string;
  binIds: string[];
}

export default function EditRouteScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<RouteForm>({
    routeName: '',
    assignedTruckId: '',
    assignedDriverId: '',
    binIds: []
  });

  // Mock data for trucks, drivers, and bins
  const [trucks] = useState<Truck[]>([
    { id: 'TRK-001', name: 'Garbage Truck 1' },
    { id: 'TRK-002', name: 'Garbage Truck 2' },
    { id: 'TRK-003', name: 'Garbage Truck 3' },
  ]);

  const [drivers] = useState<Driver[]>([
    { id: 'DRV-001', name: 'John Doe' },
    { id: 'DRV-002', name: 'Jane Smith' },
    { id: 'DRV-003', name: 'Mike Johnson' },
    { id: 'DRV-004', name: 'Sarah Williams' },
  ]);

  const [bins] = useState<Bin[]>([
    { id: 'BIN-001', name: 'Bin 1', location: 'Main St & 1st Ave' },
    { id: 'BIN-002', name: 'Bin 2', location: 'Center Plaza' },
    { id: 'BIN-003', name: 'Bin 3', location: '5th Ave & Oak St' },
    { id: 'BIN-004', name: 'Bin 4', location: 'Maple Street' },
    { id: 'BIN-005', name: 'Bin 5', location: 'Pine Road' },
    { id: 'BIN-006', name: 'Bin 6', location: 'Oak Boulevard' },
    { id: 'BIN-007', name: 'Bin 7', location: 'Business Park' },
    { id: 'BIN-008', name: 'Bin 8', location: 'Mall Complex' },
    { id: 'BIN-009', name: 'Bin 9', location: 'Office Buildings' },
  ]);

  useEffect(() => {
    fetchRouteData();
  }, [id]);

  const fetchRouteData = async () => {
    try {
      // Here you would make an API call to fetch the route data
      // For now, we'll simulate it with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockData: RouteForm;
      if (id === '1') {
        mockData = {
          routeName: 'Downtown Route',
          assignedTruckId: 'TRK-001',
          assignedDriverId: 'DRV-001',
          binIds: ['BIN-001', 'BIN-002', 'BIN-003']
        };
      } else if (id === '2') {
        mockData = {
          routeName: 'Residential Area',
          assignedTruckId: 'TRK-002',
          assignedDriverId: 'DRV-002',
          binIds: ['BIN-004', 'BIN-005', 'BIN-006']
        };
      } else {
        mockData = {
          routeName: 'Commercial Zone',
          assignedTruckId: 'TRK-003',
          assignedDriverId: 'DRV-003',
          binIds: ['BIN-007', 'BIN-008', 'BIN-009']
        };
      }
      
      setForm(mockData);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch route data');
      setIsLoading(false);
    }
  };

  const handleBinToggle = (binId: string) => {
    setForm(prev => {
      if (prev.binIds.includes(binId)) {
        return { ...prev, binIds: prev.binIds.filter(id => id !== binId) };
      } else {
        return { ...prev, binIds: [...prev.binIds, binId] };
      }
    });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!form.routeName || !form.assignedTruckId || !form.assignedDriverId || form.binIds.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and select at least one bin');
      return;
    }

    try {
      // Here you would make an API call to update the route
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        'Success',
        'Route updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update route');
    }
  };

  const renderBin = ({ item }: { item: Bin }) => {
    const isSelected = form.binIds.includes(item.id);
    
    return (
      <BinItem selected={isSelected}>
        <BinCheckbox 
          selected={isSelected} 
          onPress={() => handleBinToggle(item.id)}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </BinCheckbox>
        <BinInfo>
          <BinName>{item.name}</BinName>
          <BinLocation>{item.location}</BinLocation>
        </BinInfo>
      </BinItem>
    );
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
          <Title>Edit Route</Title>
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
        <Title>Edit Route</Title>
      </Header>

      <FormContainer>
        <FormGroup>
          <Label>Route Name *</Label>
          <Input
            placeholder="Enter route name"
            placeholderTextColor={theme.colors.text.secondary}
            value={form.routeName}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, routeName: text }))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Assigned Truck *</Label>
          <PickerContainer>
            <Picker
              selectedValue={form.assignedTruckId}
              onValueChange={(value: string) => setForm(prev => ({ ...prev, assignedTruckId: value }))}
              style={{ color: theme.colors.text.primary }}
            >
              <Picker.Item label="Select a truck" value="" />
              {trucks.map((truck) => (
                <Picker.Item 
                  key={truck.id} 
                  label={truck.name} 
                  value={truck.id} 
                />
              ))}
            </Picker>
          </PickerContainer>
        </FormGroup>

        <FormGroup>
          <Label>Assigned Driver *</Label>
          <PickerContainer>
            <Picker
              selectedValue={form.assignedDriverId}
              onValueChange={(value: string) => setForm(prev => ({ ...prev, assignedDriverId: value }))}
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
          <Label>Select Bins *</Label>
          <BinSelectionContainer>
            <FlatList
              data={bins}
              renderItem={renderBin}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </BinSelectionContainer>
        </FormGroup>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Update Route</SubmitButtonText>
        </SubmitButton>
      </FormContainer>
    </Container>
  );
} 