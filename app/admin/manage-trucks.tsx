import React, { useState } from 'react';
import { FlatList, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import AdminLayout from '../../components/AdminLayout';
import {
  PlatformContainer,
  PlatformHeader,
  PlatformBlurHeader,
  PlatformSearchContainer,
  PlatformInput,
  PlatformListItem,
  PlatformAvatar,
  PlatformText,
  PlatformTitle,
} from '../components/PlatformStyles';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

// Styled components
const MenuButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const AddButton = styled.TouchableOpacity`
  padding: 8px;
`;

const TruckInfo = styled.View`
  flex: 1;
`;

const TruckLicense = styled(PlatformText)`
  font-weight: ${Platform.OS === 'ios' ? '600' : 'bold'};
`;

const TruckStatus = styled(PlatformText)`
  font-size: ${Platform.OS === 'ios' ? '13' : '14'}px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-top: ${Platform.OS === 'ios' ? '1' : '2'}px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

const StatusBadge = styled.View<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => {
    switch (props.status) {
      case 'ACTIVE':
        return '#4CAF50';
      case 'MAINTENANCE':
        return '#FFC107';
      case 'INACTIVE':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }};
  margin-top: 4px;
`;

const StatusText = styled(PlatformText)`
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

enum GarbageTruckStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE'
}

interface Truck {
  id: string;
  licenseNumber: string;
  vehicleId: string;
  isAvailable: boolean;
  currentLat: number;
  currentLng: number;
  speed: number;
  status: GarbageTruckStatus;
  lastUpdated: Date;
  driverId: string;
}

export default function ManageTrucksScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trucks, setTrucks] = useState<Truck[]>([
    {
      id: '1',
      licenseNumber: 'TRK-001',
      vehicleId: 'VH-001',
      isAvailable: true,
      currentLat: 14.5995,
      currentLng: 120.9842,
      speed: 45,
      status: GarbageTruckStatus.ACTIVE,
      lastUpdated: new Date(),
      driverId: 'DRV-001'
    },
    {
      id: '2',
      licenseNumber: 'TRK-002',
      vehicleId: 'VH-002',
      isAvailable: false,
      currentLat: 14.5996,
      currentLng: 120.9843,
      speed: 0,
      status: GarbageTruckStatus.MAINTENANCE,
      lastUpdated: new Date(),
      driverId: 'DRV-002'
    },
    {
      id: '3',
      licenseNumber: 'TRK-003',
      vehicleId: 'VH-003',
      isAvailable: false,
      currentLat: 14.5997,
      currentLng: 120.9844,
      speed: 0,
      status: GarbageTruckStatus.INACTIVE,
      lastUpdated: new Date(),
      driverId: 'DRV-003'
    }
  ]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const filteredTrucks = trucks.filter(truck =>
    truck.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
    truck.vehicleId.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (truck: Truck) => {
    router.push(`/admin/edit-truck?id=${truck.id}`);
  };

  const handleDelete = (truck: Truck) => {
    Alert.alert(
      'Delete Truck',
      `Are you sure you want to delete truck ${truck.licenseNumber}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTrucks(prev => prev.filter(t => t.id !== truck.id));
          }
        }
      ]
    );
  };

  const handleAdd = () => {
    router.push('/admin/add-truck' as Href);
  };

  const renderTruck = ({ item }: { item: Truck }) => (
    <PlatformListItem theme={theme}>
      <PlatformAvatar source={{ uri: `https://ui-avatars.com/api/?name=${item.licenseNumber}&background=random` }} />
      <TruckInfo>
        <TruckLicense theme={theme}>{item.licenseNumber}</TruckLicense>
        <TruckStatus theme={theme}>Vehicle ID: {item.vehicleId}</TruckStatus>
        <StatusBadge status={item.status}>
          <StatusText>{item.status}</StatusText>
        </StatusBadge>
      </TruckInfo>
      <ActionButton onPress={() => handleEdit(item)}>
        <Ionicons name="pencil" size={20} color={theme.colors.primary} />
      </ActionButton>
      <ActionButton onPress={() => handleDelete(item)}>
        <Ionicons name="trash" size={20} color={theme.colors.text.secondary} />
      </ActionButton>
    </PlatformListItem>
  );

  return (
    <AdminLayout 
      currentRoute="/admin/manage-trucks"
      isOpen={isMenuOpen}
      onToggleMenu={toggleMenu}
    >
      <PlatformContainer theme={theme}>
        {Platform.OS === 'ios' && (
          <PlatformBlurHeader intensity={80} tint={theme.colors.background === '#000000' ? 'dark' : 'light'} />
        )}
        <PlatformHeader theme={theme}>
          <MenuButton onPress={toggleMenu}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'menu'}
              size={24}
              color={theme.colors.text.primary}
            />
          </MenuButton>
          <PlatformTitle theme={theme}>Manage Trucks</PlatformTitle>
          <AddButton onPress={handleAdd}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'add-circle' : 'add'}
              size={24}
              color={theme.colors.primary}
            />
          </AddButton>
        </PlatformHeader>

        <PlatformSearchContainer theme={theme}>
          <Ionicons
            name="search"
            size={Platform.OS === 'ios' ? 18 : 20}
            color={theme.colors.text.secondary}
          />
          <PlatformInput
            placeholder="Search trucks"
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
            theme={theme}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </PlatformSearchContainer>

        <FlatList
          data={filteredTrucks}
          renderItem={renderTruck}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0
          }}
        />
      </PlatformContainer>
    </AdminLayout>
  );
} 