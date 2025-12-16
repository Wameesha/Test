import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DiabetesSectionScreen } from '../../src/features/medical-records/screens';
import { FolderDetailScreen } from '../../src/features/medical-records/screens';

export default function CategoryDetailRoute() {
  const { id } = useLocalSearchParams();

  if (id === 'diabetes') {
    return <DiabetesSectionScreen />;
  }

  return <FolderDetailScreen />;
}
