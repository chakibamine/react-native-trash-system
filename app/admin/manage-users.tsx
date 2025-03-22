import React, { useState } from 'react';
import { FlatList, Alert, View } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Role } from '@/types/user';
import AdminLayout from '../components/AdminLayout';

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
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const SearchInput = styled.TextInput<ThemeProps>`
  height: 40px;
  padding: 8px 16px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const UserItem = styled.TouchableOpacity<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const Avatar = styled.View<ThemeProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const AvatarText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const UserEmail = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const StatusBadge = styled.View<{ isActive: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => props.isActive ? '#4CAF50' : '#F44336'};
  margin-left: 8px;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  address?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  isAvailable?: boolean;
}

export default function ManageUsersScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'John Doe',
      email: 'john@example.com',
      role: Role.NORMAL_USER,
      isActive: true,
      address: '123 Main St',
      phoneNumber: '+1234567890',
    },
    {
      id: '2',
      username: 'Jane Smith',
      email: 'jane@example.com',
      role: Role.NORMAL_USER,
      isActive: false,
      address: '456 Oak Ave',
      phoneNumber: '+0987654321',
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (user: User) => {
    router.push(`/admin/edit-user?id=${user.id}`);
  };

  const handleDelete = (user: User) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Here you would make an API call to delete the user
            setUsers(users.filter(u => u.id !== user.id));
            Alert.alert('Success', 'User deleted successfully');
          },
        },
      ]
    );
  };

  const handleAdd = () => {
    router.push('/admin/add-user');
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <UserItem>
      <Avatar>
        <AvatarText>{item.username.charAt(0)}</AvatarText>
      </Avatar>
      <UserInfo>
        <UserName>{item.username}</UserName>
        <UserEmail>{item.email}</UserEmail>
      </UserInfo>
      <StatusBadge isActive={item.isActive}>
        <StatusText>{item.isActive ? 'Active' : 'Inactive'}</StatusText>
      </StatusBadge>
      <ActionButton onPress={() => handleEdit(item)}>
        <Ionicons
          name="pencil"
          size={24}
          color={theme.colors.text.primary}
        />
      </ActionButton>
      <ActionButton onPress={() => handleDelete(item)}>
        <Ionicons
          name="trash"
          size={24}
          color={theme.colors.error}
        />
      </ActionButton>
    </UserItem>
  );

  return (
    <AdminLayout 
      currentRoute="/admin/manage-users"
      isOpen={isMenuOpen}
      onToggleMenu={toggleMenu}
    >
      <Container style={{ paddingTop: insets.top }}>
        <Header>
          <MenuButton onPress={toggleMenu}>
            <Ionicons
              name="menu"
              size={24}
              color={theme.colors.text.primary}
            />
          </MenuButton>
          <Title>Manage Users</Title>
          <AddButton onPress={handleAdd}>
            <Ionicons
              name="add"
              size={24}
              color={theme.colors.text.primary}
            />
          </AddButton>
        </Header>

        <SearchContainer>
          <SearchInput
            placeholder="Search users..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </SearchContainer>

        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        />
      </Container>
    </AdminLayout>
  );
} 