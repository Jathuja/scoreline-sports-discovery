import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme, useAppTheme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import {
  useAppDispatch,
  useAppSelector,
  logoutThunk,
  saveThemeModeThunk,
} from '../../../store';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTheme = useAppTheme();
  const { user } = useAppSelector(state => state.auth);
  const { themeMode } = useAppSelector(state => state.app);

  const isDarkEnabled = themeMode === 'dark' || activeTheme.isDark;

  const handleToggleDarkMode = (value: boolean) => {
    dispatch(saveThemeModeThunk(value ? 'dark' : 'light'));
  };

  return (
    <ScreenContainer testID="profile-screen-container">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: activeTheme.colors.surface,
              borderColor: activeTheme.colors.border,
            },
          ]}
          testID="profile-details-card">
          <View style={styles.avatarRow}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: `${activeTheme.colors.primary}20` },
              ]}>
              <Icon name="user" size={24} color={activeTheme.colors.primary} />
            </View>
            <View style={styles.avatarMeta}>
              <Typography variant="h2" style={styles.cardTitle}>
                {user ? `${user.firstName} ${user.lastName}` : 'User Profile'}
              </Typography>
              <Typography variant="body" color="secondary" style={styles.infoRow}>
                Username: @{user?.username || 'user'}
              </Typography>
            </View>
          </View>

          <Typography variant="body" color="secondary" style={styles.infoRow}>
            Email: {user?.email || 'user@example.com'}
          </Typography>
          <View style={styles.securityRow}>
            <Icon
              name="shield"
              size={14}
              color={activeTheme.colors.success}
              style={styles.inlineIcon}
            />
            <Typography variant="caption" color="success" style={styles.securityStatus}>
              Security: Hardware Keychain Token Secured (Zero AsyncStorage Leaks)
            </Typography>
          </View>
          <Typography variant="caption" color="tertiary" style={styles.infoRow}>
            Index Number: 234089P
          </Typography>

          <View
            testID="profile-theme-card"
            style={[
              styles.preferenceRow,
              {
                borderColor: activeTheme.colors.border,
                backgroundColor: activeTheme.colors.surfaceSubtle,
              },
            ]}>
            <View style={styles.preferenceLabelGroup}>
              <Icon
                name={isDarkEnabled ? 'moon' : 'sun'}
                size={18}
                color={activeTheme.colors.primary}
                style={styles.inlineIcon}
              />
              <View>
                <Typography variant="label">Dark Mode</Typography>
                <Typography variant="caption" color="secondary">
                  Remembered across restarts
                </Typography>
              </View>
            </View>
            <Switch
              testID="dark-mode-switch"
              value={isDarkEnabled}
              onValueChange={handleToggleDarkMode}
              trackColor={{
                false: activeTheme.colors.border,
                true: activeTheme.colors.primaryLight,
              }}
              thumbColor={
                isDarkEnabled
                  ? activeTheme.colors.primary
                  : activeTheme.colors.surface
              }
            />
          </View>

          <View style={styles.logoutContainer}>
            <Button
              testID="profile-sign-out-button"
              title="Sign Out"
              icon="log-out"
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
    padding: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.md,
    borderWidth: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarMeta: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 2,
  },
  infoRow: {
    marginBottom: theme.spacing.xs,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  inlineIcon: {
    marginRight: 8,
  },
  securityStatus: {
    flex: 1,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
    borderWidth: 1,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  preferenceLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutContainer: {
    marginTop: theme.spacing.lg,
  },
});
