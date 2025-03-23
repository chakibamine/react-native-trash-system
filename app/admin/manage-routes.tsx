import React, { useState } from 'react';
import { FlatList, Alert, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import AdminLayout from '../../components/AdminLayout';
import { BlurView } from 'expo-blur';

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
  padding: ${Platform.OS === 'ios' ? '12px 16px' : '16px'};
  background-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? 'transparent' : props.theme.colors.surface};
  border-bottom-width: ${Platform.OS === 'ios' ? '0' : '1px'};
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const BlurHeader = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const MenuButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  flex: 1;
`;

const AddButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SearchContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? '8px 16px' : '8px 16px'};
  background-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? 'transparent' : props.theme.colors.surface};
  border-bottom-width: ${Platform.OS === 'ios' ? '0' : '1px'};
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const SearchInput = styled.TextInput<ThemeProps>`
  flex: 1;
  height: ${Platform.OS === 'ios' ? '36px' : '40px'};
  padding: ${Platform.OS === 'ios' ? '8px 12px' : '8px 12px'};
  margin-left: 8px;
  border-radius: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? '10' : props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? props.theme.colors.background + '80' : props.theme.colors.background};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: ${Platform.OS === 'ios' ? '15' : '16'}px;
`;

const RouteItem = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? '12px 16px' : '16px'};
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: ${Platform.OS === 'ios' ? '0.5' : '1'}px;
  border-bottom-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? props.theme.colors.border + '80' : props.theme.colors.border};
`;

const RouteIcon = styled.View<ThemeProps>`
  width: ${Platform.OS === 'ios' ? '40px' : '50px'};
  height: ${Platform.OS === 'ios' ? '40px' : '50px'};
  border-radius: ${Platform.OS === 'ios' ? '20' : '25'}px;
  margin-right: ${Platform.OS === 'ios' ? '10px' : '12px'};
  background-color: ${(props: ThemeProps) => props.theme.colors.primary + '20'};
  justify-content: center;
  align-items: center;
`;

const RouteInfo = styled.View`
  flex: 1;
`;

const RouteName = styled.Text<ThemeProps>`
  font-size: ${Platform.OS === 'ios' ? '15' : '16'}px;
  font-weight: ${Platform.OS === 'ios' ? '600' : '600'};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const RouteDetails = styled.Text<ThemeProps>`
  font-size: ${Platform.OS === 'ios' ? '13' : '14'}px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-top: ${Platform.OS === 'ios' ? '1' : '2'}px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

interface Bin {
  id: string;
  location: string;
}

interface Route {
  id: string;
  routeName: string;
  assignedTruckId: string;
  assignedTruck?: string;
  assignedDriverId: string;
  assignedDriver?: string;
  bins: Bin[];
}

export default function ManageRoutesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: '1',
      routeName: 'Downtown Route',
      assignedTruckId: 'TRK-001',
      assignedTruck: 'Garbage Truck 1',
      assignedDriverId: 'DRV-001',
      assignedDriver: 'John Doe',
      bins: [
        { id: 'BIN-001', location: 'Main St & 1st Ave' },
        { id: 'BIN-002', location: 'Center Plaza' },
        { id: 'BIN-003', location: '5th Ave & Oak St' }
      ]
    },
    {
      id: '2',
      routeName: 'Residential Area',
      assignedTruckId: 'TRK-002',
      assignedTruck: 'Garbage Truck 2',
      assignedDriverId: 'DRV-002',
      assignedDriver: 'Jane Smith',
      bins: [
        { id: 'BIN-004', location: 'Maple Street' },
        { id: 'BIN-005', location: 'Pine Road' },
        { id: 'BIN-006', location: 'Oak Boulevard' }
      ]
    },
    {
      id: '3',
      routeName: 'Commercial Zone',
      assignedTruckId: 'TRK-003',
      assignedTruck: 'Garbage Truck 3',
      assignedDriverId: 'DRV-003',
      assignedDriver: 'Mike Johnson',
      bins: [
        { id: 'BIN-007', location: 'Business Park' },
        { id: 'BIN-008', location: 'Mall Complex' },
        { id: 'BIN-009', location: 'Office Buildings' }
      ]
    }
  ]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const filteredRoutes = routes.filter(route =>
    route.routeName.toLowerCase().includes(search.toLowerCase()) ||
    route.assignedDriver?.toLowerCase().includes(search.toLowerCase()) ||
    route.assignedTruck?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (route: Route) => {
    router.push(`/admin/edit-route?id=${route.id}`);
  };

  const handleDelete = (route: Route) => {
    Alert.alert(
      'Delete Route',
      `Are you sure you want to delete ${route.routeName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRoutes(prev => prev.filter(r => r.id !== route.id));
          }
        }
      ]
    );
  };

  const handleAdd = () => {
    router.push('/admin/add-route' as Href);
  };

  const renderRoute = ({ item }: { item: Route }) => (
    <RouteItem>
      <RouteIcon>
        <Ionicons name="map" size={24} color={theme.colors.primary} />
      </RouteIcon>
      <RouteInfo>
        <RouteName>{item.routeName}</RouteName>
        <RouteDetails>Truck: {item.assignedTruck}</RouteDetails>
        <RouteDetails>Driver: {item.assignedDriver}</RouteDetails>
        <RouteDetails>Bins: {item.bins.length}</RouteDetails>
      </RouteInfo>
      <ActionButton onPress={() => handleEdit(item)}>
        <Ionicons name="pencil" size={20} color={theme.colors.primary} />
      </ActionButton>
      <ActionButton onPress={() => handleDelete(item)}>
        <Ionicons name="trash" size={20} color={theme.colors.text.secondary} />
      </ActionButton>
    </RouteItem>
  );

  return (
    <AdminLayout 
      currentRoute="/admin/manage-routes"
      isOpen={isMenuOpen}
      onToggleMenu={toggleMenu}
    >
      <Container>
        {Platform.OS === 'ios' && (
          <BlurHeader intensity={80} tint={theme.colors.background === '#000000' ? 'dark' : 'light'} />
        )}
        <Header>
          <MenuButton onPress={toggleMenu}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'menu'}
              size={24}
              color={theme.colors.text.primary}
            />
          </MenuButton>
          <Title>Manage Routes</Title>
          <AddButton onPress={handleAdd}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'add-circle' : 'add'}
              size={24}
              color={theme.colors.primary}
            />
          </AddButton>
        </Header>

        <SearchContainer>
          <Ionicons
            name="search"
            size={Platform.OS === 'ios' ? 18 : 20}
            color={theme.colors.text.secondary}
          />
          <SearchInput
            placeholder="Search routes"
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </SearchContainer>

        <FlatList
          data={filteredRoutes}
          renderItem={renderRoute}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0
          }}
        />
      </Container>
    </AdminLayout>
  );
} 