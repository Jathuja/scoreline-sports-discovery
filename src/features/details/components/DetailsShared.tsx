import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme, useAppTheme } from '../../../theme';

export interface DetailsActionBarProps {
  onShare: () => void;
  onToggleFavourite: () => void;
  isFavourite: boolean;
}

/** Shared Share and Favourite action buttons using Feather icons and min 48dp touch targets. */
export const DetailsActionBar: React.FC<DetailsActionBarProps> = ({
  onShare,
  onToggleFavourite,
  isFavourite,
}) => {
  const activeTheme = useAppTheme();

  return (
    <View style={styles.actions}>
      <TouchableOpacity
        testID="share-button"
        style={[
          styles.actionButton,
          { borderColor: activeTheme.colors.primary },
        ]}
        onPress={onShare}
        activeOpacity={0.8}>
        <Icon name="share-2" size={16} color={activeTheme.colors.primary} />
        <Text
          style={[styles.actionLabel, { color: activeTheme.colors.primary }]}>
          Share
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="favourite-button"
        style={[
          styles.actionButton,
          { borderColor: activeTheme.colors.primary },
          isFavourite && { backgroundColor: activeTheme.colors.primary },
        ]}
        onPress={onToggleFavourite}
        activeOpacity={0.8}>
        <Icon
          name="heart"
          size={16}
          color={
            isFavourite
              ? activeTheme.colors.textInverse
              : activeTheme.colors.primary
          }
        />
        <Text
          style={[
            styles.actionLabel,
            {
              color: isFavourite
                ? activeTheme.colors.textInverse
                : activeTheme.colors.primary,
            },
          ]}>
          {isFavourite ? 'Saved' : 'Favourite'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export interface DetailsInfoRowProps {
  label: string;
  value: string;
  testID?: string;
}

/** Shared label/value row inside details metadata cards. */
export const DetailsInfoRow: React.FC<DetailsInfoRowProps> = ({
  label,
  value,
  testID,
}) => {
  const activeTheme = useAppTheme();
  return (
    <View
      testID={testID}
      style={[
        styles.infoRow,
        { borderBottomColor: activeTheme.colors.border },
      ]}>
      <Text
        style={[styles.infoLabel, { color: activeTheme.colors.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[styles.infoValue, { color: activeTheme.colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
};

export interface DeepLinkBannerProps {
  uri: string;
}

/** Shared deep-link preview badge using Feather link icon. */
export const DeepLinkBanner: React.FC<DeepLinkBannerProps> = ({ uri }) => {
  const activeTheme = useAppTheme();
  return (
    <View
      style={[
        styles.deepLinkCard,
        { backgroundColor: activeTheme.colors.surface },
      ]}>
      <Icon name="link" size={14} color={activeTheme.colors.primary} />
      <Text style={[styles.deepLinkText, { color: activeTheme.colors.primary }]}>
        {uri}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 24,
    borderWidth: 2,
    minHeight: theme.layout.touchTargets.minHeight,
    gap: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: theme.spacing.sm,
  },
  deepLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  deepLinkText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
