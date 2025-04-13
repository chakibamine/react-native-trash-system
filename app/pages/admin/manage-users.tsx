import React, { useState } from 'react';
import { FlatList, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import AdminLayout from '../../../components/AdminLayout';
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
} from '../../components/PlatformStyles';

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

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled(PlatformText)`
  font-weight: ${Platform.OS === 'ios' ? '600' : 'bold'};
`;

const UserEmail = styled(PlatformText)`
  font-size: ${Platform.OS === 'ios' ? '13' : '14'}px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-top: ${Platform.OS === 'ios' ? '1' : '2'}px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'premium';
  status: 'active' | 'inactive';
}

export default function ManageUsersScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      role: 'premium',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
      role: 'user',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
      role: 'user',
      status: 'inactive'
    }
  ]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user: User) => {
    router.push(`/admin/edit-user?id=${user.id}`);
  };

  const handleDelete = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers(prev => prev.filter(u => u.id !== user.id));
          }
        }
      ]
    );
  };

  const handleAdd = () => {
    router.push('/admin/add-user' as Href);
  };

  const renderUser = ({ item }: { item: User }) => (
    <PlatformListItem theme={theme}>
      <PlatformAvatar source={{ uri: item.avatar }} />
      <UserInfo>
        <UserName theme={theme}>{item.name}</UserName>
        <UserEmail theme={theme}>{item.email}</UserEmail>
      </UserInfo>
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
      currentRoute="/admin/manage-users"
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
          <PlatformTitle theme={theme}>Manage Users</PlatformTitle>
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
            placeholder="Search users"
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
            theme={theme}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </PlatformSearchContainer>

        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
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