import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import type { PlayerDetailsRouteProp } from '../../../navigation/types';

export const PlayerDetailsScreen: React.FC = () => {
  const route = useRoute<PlayerDetailsRouteProp>();
  const navigation = useNavigation();
  const { id, name } = route.params;

  return (
    <ScreenContainer testID="player-details-container">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Typography variant="caption" color="primary">
            Player Details
          </Typography>
          <Typography variant="h1" style={styles.title}>
            {name || `Player #${id}`}
          </Typography>
          <Typography variant="body" color="secondary" style={styles.idBadge}>
            TheSportsDB ID: {id}
          </Typography>
          <Typography variant="caption" color="tertiary" style={styles.deepLinkBadge}>
            Deep Link Path: scoreline://player/{id}
          </Typography>

          <View style={styles.buttonContainer}>
            <Button
              testID="player-details-back-button"
              title="Go Back"
              variant="outline"
              size="sm"
              onPress={() => navigation.goBack()}
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
  title: {
    marginVertical: theme.spacing.sm,
  },
  idBadge: {
    marginBottom: theme.spacing.xs,
  },
  deepLinkBadge: {
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    marginTop: theme.spacing.sm,
  },
});
