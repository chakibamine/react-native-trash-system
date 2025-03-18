import React, { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import { Role } from '@/types/user';

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

const AddButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SearchContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const SearchInput = styled.TextInput<ThemeProps>`
  flex: 1;
  height: 40px;
  padding: 8px 12px;
  margin-left: 8px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const DriverItem = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
`;

const DriverInfo = styled.View`
  flex: 1;
`;

const DriverName = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const DriverEmail = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-top: 2px;
`;

const StatusBadge = styled.View<ThemeProps & { isActive: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${(props: ThemeProps & { isActive: boolean }) =>
    props.isActive ? props.theme.colors.success : props.theme.colors.error};
  margin-top: 4px;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 500;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

interface Driver {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isActive: boolean;
  isAvailable: boolean;
  licenseNumber: string;
  phoneNumber: string;
}

export default function ManageDriversScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      username: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      isActive: true,
      isAvailable: true,
      licenseNumber: 'DL123456',
      phoneNumber: '+1234567890'
    },
    {
      id: '2',
      username: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
      isActive: true,
      isAvailable: false,
      licenseNumber: 'DL789012',
      phoneNumber: '+9876543210'
    },
    {
      id: '3',
      username: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
      isActive: false,
      isAvailable: false,
      licenseNumber: 'DL345678',
      phoneNumber: '+4567891230'
    }
  ]);

  const filteredDrivers = drivers.filter(driver =>
    driver.username.toLowerCase().includes(search.toLowerCase()) ||
    driver.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (driver: Driver) => {
    router.push(`/admin/edit-driver?id=${driver.id}`);
  };

  const handleDelete = (driver: Driver) => {
    Alert.alert(
      'Delete Driver',
      `Are you sure you want to delete ${driver.username}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDrivers(prev => prev.filter(d => d.id !== driver.id));
          }
        }
      ]
    );
  };

  const handleAdd = () => {
    router.push('/admin/add-driver' as Href);
  };

  const renderDriver = ({ item }: { item: Driver }) => (
    <DriverItem>
      <Avatar source={{ uri: item.avatar }} />
      <DriverInfo>
        <DriverName>{item.username}</DriverName>
        <DriverEmail>{item.email}</DriverEmail>
        <StatusBadge isActive={item.isActive}>
          <StatusText>{item.isActive ? 'Active' : 'Inactive'}</StatusText>
        </StatusBadge>
      </DriverInfo>
      <ActionButton onPress={() => handleEdit(item)}>
        <Ionicons name="pencil" size={20} color={theme.colors.primary} />
      </ActionButton>
      <ActionButton onPress={() => handleDelete(item)}>
        <Ionicons name="trash" size={20} color={theme.colors.text.secondary} />
      </ActionButton>
    </DriverItem>
  );

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
        <Title>Manage Drivers</Title>
        <AddButton onPress={handleAdd}>
          <Ionicons
            name="add"
            size={24}
            color={theme.colors.primary}
          />
        </AddButton>
      </Header>

      <SearchContainer>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.text.secondary}
        />
        <SearchInput
          placeholder="Search drivers"
          placeholderTextColor={theme.colors.text.secondary}
          value={search}
          onChangeText={setSearch}
        />
      </SearchContainer>

      <FlatList
        data={filteredDrivers}
        renderItem={renderDriver}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
} 