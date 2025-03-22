import React, { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
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

const AdminItem = styled.View<ThemeProps>`
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

const AdminInfo = styled.View`
  flex: 1;
`;

const AdminName = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const AdminEmail = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-top: 2px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

interface Admin {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'super_admin' | 'admin';
  status: 'active' | 'inactive';
}

export default function ManageAdminsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      role: 'super_admin',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
      role: 'admin',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
      role: 'admin',
      status: 'inactive'
    }
  ]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (admin: Admin) => {
    router.push(`/admin/edit-admin?id=${admin.id}`);
  };

  const handleDelete = (admin: Admin) => {
    Alert.alert(
      'Delete Admin',
      `Are you sure you want to delete ${admin.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAdmins(prev => prev.filter(a => a.id !== admin.id));
          }
        }
      ]
    );
  };

  const handleAdd = () => {
    router.push('/admin/add-admin' as Href);
  };

  const renderAdmin = ({ item }: { item: Admin }) => (
    <AdminItem>
      <Avatar source={{ uri: item.avatar }} />
      <AdminInfo>
        <AdminName>{item.name}</AdminName>
        <AdminEmail>{item.email}</AdminEmail>
      </AdminInfo>
      <ActionButton onPress={() => handleEdit(item)}>
        <Ionicons name="pencil" size={20} color={theme.colors.primary} />
      </ActionButton>
      <ActionButton onPress={() => handleDelete(item)}>
        <Ionicons name="trash" size={20} color={theme.colors.text.secondary} />
      </ActionButton>
    </AdminItem>
  );

  return (
    <AdminLayout 
      currentRoute="/admin/manage-admins"
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
          <Title>Manage Admins</Title>
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
            placeholder="Search admins"
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
          />
        </SearchContainer>

        <FlatList
          data={filteredAdmins}
          renderItem={renderAdmin}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </AdminLayout>
  );
} 