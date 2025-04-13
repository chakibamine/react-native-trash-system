import React, { useState } from 'react';
import { FlatList, Alert, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import AdminLayout from '../../../components/AdminLayout';
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

const AdminItem = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? '12px 16px' : '16px'};
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: ${Platform.OS === 'ios' ? '0.5' : '1'}px;
  border-bottom-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? props.theme.colors.border + '80' : props.theme.colors.border};
`;

const Avatar = styled.Image`
  width: ${Platform.OS === 'ios' ? '40px' : '50px'};
  height: ${Platform.OS === 'ios' ? '40px' : '50px'};
  border-radius: ${Platform.OS === 'ios' ? '20' : '25'}px;
  margin-right: ${Platform.OS === 'ios' ? '10px' : '12px'};
`;

const AdminInfo = styled.View`
  flex: 1;
`;

const AdminName = styled.Text<ThemeProps>`
  font-size: ${Platform.OS === 'ios' ? '15' : '16'}px;
  font-weight: ${Platform.OS === 'ios' ? '600' : '600'};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const AdminEmail = styled.Text<ThemeProps>`
  font-size: ${Platform.OS === 'ios' ? '13' : '14'}px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-top: ${Platform.OS === 'ios' ? '1' : '2'}px;
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
      <Container >
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
          <Title>Manage Admins</Title>
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
            placeholder="Search admins"
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </SearchContainer>

        <FlatList
          data={filteredAdmins}
          renderItem={renderAdmin}
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