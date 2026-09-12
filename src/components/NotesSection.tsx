import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SPACING, FONT_SIZES } from '@constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@contexts/ThemeContext';
interface AnotacaoData {
  id: number;
  texto: string;
  dataCriacao?: string;
}
interface NotesSectionProps {
  petId: number;
  anotacoesList: AnotacaoData[];
  onSaveSuccess: () => void;
  onDeleteSuccess?: () => void;
}
export const NotesSection: React.FC<NotesSectionProps> = ({ petId, anotacoesList, onSaveSuccess, onDeleteSuccess }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const [anotacao, setAnotacao] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const handleSaveNote = async () => {
    if (!anotacao.trim()) return;
    setSavingNote(true);
    try {
      const key = `@pet_notes_${petId}`;
      const currentNotesRaw = await AsyncStorage.getItem(key);
      const currentNotes: AnotacaoData[] = currentNotesRaw ? JSON.parse(currentNotesRaw) : [];
      const newNote: AnotacaoData = {
        id: Date.now(),
        texto: anotacao.trim(),
        dataCriacao: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      const updatedNotes = [newNote, ...currentNotes];
      await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));
      Alert.alert('Sucesso!', 'Anotação salva com sucesso.');
      setAnotacao('');
      onSaveSuccess();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a anotação localmente.');
    } finally {
      setSavingNote(false);
    }
  };
  const handleDeleteNote = (noteId: number) => {
    Alert.alert('Excluir Anotação', 'Tem certeza que deseja apagar esta observação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const key = `@pet_notes_${petId}`;
            const currentNotesRaw = await AsyncStorage.getItem(key);
            if (currentNotesRaw) {
              const currentNotes: AnotacaoData[] = JSON.parse(currentNotesRaw);
              const updatedNotes = currentNotes.filter((note) => note.id !== noteId);
              await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));
              Alert.alert('Sucesso', 'Anotação excluída com sucesso.');
              if (onDeleteSuccess) {
                onDeleteSuccess();
              } else {
                onSaveSuccess();
              }
            }
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a anotação.');
          }
        },
      },
    ]);
  };
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>ANOTAÇÕES DO TUTOR</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Adicione observações diárias sobre o pet..."
        placeholderTextColor={COLORS.textSecondary}
        multiline
        value={anotacao}
        onChangeText={setAnotacao}
      />
      <TouchableOpacity
        style={[styles.saveNoteButton, (!anotacao.trim() || savingNote) && styles.buttonDisabled]}
        onPress={handleSaveNote}
        disabled={!anotacao.trim() || savingNote}
      >
        {savingNote ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.saveNoteText}>Salvar Anotação</Text>
        )}
      </TouchableOpacity>

      {anotacoesList.length > 0 && (
        <View style={styles.notesListContainer}>
          <Text style={styles.notesListHeader}>Histórico Clínico:</Text>
          {anotacoesList.map((item) => (
            <View key={item.id.toString()} style={styles.noteItemCard}>
              <View style={styles.noteItemHeader}>
                {item.dataCriacao ? <Text style={styles.noteItemDate}>{item.dataCriacao}</Text> : <View />}
                <TouchableOpacity
                  onPress={() => handleDeleteNote(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.noteItemText}>{item.texto}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    sectionCard: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginTop: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '700',
      color: COLORS.dark,
      marginBottom: SPACING.md,
      letterSpacing: 0.5,
    },
    textArea: {
      backgroundColor: COLORS.background,
      borderRadius: 12,
      padding: SPACING.md,
      height: 80,
      textAlignVertical: 'top',
      fontSize: FONT_SIZES.md,
      color: COLORS.dark,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    saveNoteButton: {
      backgroundColor: COLORS.primary,
      borderRadius: 12,
      padding: SPACING.md,
      alignItems: 'center',
      marginTop: SPACING.sm,
      height: 48,
      justifyContent: 'center',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    saveNoteText: {
      color: COLORS.white,
      fontWeight: '700',
      fontSize: FONT_SIZES.md,
    },
    notesListContainer: {
      marginTop: SPACING.lg,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingTop: SPACING.md,
    },
    notesListHeader: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.dark,
      marginBottom: SPACING.sm,
    },
    noteItemCard: {
      backgroundColor: COLORS.background,
      padding: SPACING.md,
      borderRadius: 12,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    noteItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    noteItemDate: {
      fontSize: 11,
      fontWeight: '600',
      color: COLORS.textSecondary,
    },
    deleteButtonText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FF3B30',
    },
    noteItemText: {
      fontSize: 13,
      color: COLORS.dark,
      lineHeight: 18,
    },
  });
