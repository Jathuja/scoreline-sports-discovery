import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import type { LeagueDetailsRouteProp } from '../../../navigation/types';

export const LeagueDetailsScreen: React.FC = () => {
  const route = useRoute<LeagueDetailsRouteProp>();
  const navigation = useNavigation();
  const { id, name } = route.params;

  return (
    <ScreenContainer testID="league-details-container">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Typography variant="caption" color="primary">
            League Details
          </Typography>
          <Typography variant="h1" style={styles.title}>
            {name || `League #${id}`}
          </Typography>
          <Typography variant="body" color="secondary" style={styles.idBadge}>
            TheSportsDB ID: {id}
          </Typography>
          <Typography variant="caption" color="tertiary" style={styles.deepLinkBadge}>
            Deep Link Path: scoreline://league/{id}
          </Typography>

          <View style={styles.buttonContainer}>
            <Button
              testID="league-details-back-button"
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
