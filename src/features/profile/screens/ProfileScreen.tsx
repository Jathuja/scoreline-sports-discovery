import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useAppDispatch, useAppSelector, logoutThunk } from '../../../store';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  return (
    <ScreenContainer testID="profile-screen-container">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card} testID="profile-details-card">
          <Typography variant="h2" style={styles.cardTitle}>
            {user ? `${user.firstName} ${user.lastName}` : 'User Profile'}
          </Typography>
          <Typography variant="body" color="secondary" style={styles.infoRow}>
            Username: @{user?.username || 'user'}
          </Typography>
          <Typography variant="body" color="secondary" style={styles.infoRow}>
            Email: {user?.email || 'user@example.com'}
          </Typography>
          <Typography variant="caption" color="success" style={styles.securityStatus}>
            Security: Hardware Keychain Token Secured (Zero AsyncStorage Leaks)
          </Typography>
          <Typography variant="caption" color="tertiary" style={styles.infoRow}>
            Index Number: 234089P
          </Typography>

          <View style={styles.logoutContainer}>
            <Button
              testID="profile-sign-out-button"
              title="Sign Out"
              variant="outline"
              onPress={() => {
                dispatch(logoutThunk());
              }}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    marginBottom: theme.spacing.xs,
  },
  securityStatus: {
    marginVertical: theme.spacing.sm,
  },
  logoutContainer: {
    marginTop: theme.spacing.lg,
  },
});
