import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { PetNote } from '@models/PetNote';
interface NotesSectionProps {
  notes: PetNote[];
  saving: boolean;
  onAdd: (texto: string) => Promise<unknown>;
  onRemove: (noteId: number) => Promise<unknown>;
}
export const NotesSection: React.FC<NotesSectionProps> = ({ notes, saving, onAdd, onRemove }) => {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const [anotacao, setAnotacao] = useState('');
  const handleSaveNote = async () => {
    if (!anotacao.trim()) return;
    try {
      await onAdd(anotacao);
      setAnotacao('');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a anotação.');
    }
  };
  const handleDeleteNote = (noteId: number) => {
    Alert.alert('Excluir Anotação', 'Tem certeza que deseja apagar esta observação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => onRemove(noteId).catch(() => Alert.alert('Erro', 'Não foi possível excluir a anotação.')),
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
        style={[styles.saveNoteButton, (!anotacao.trim() || saving) && styles.buttonDisabled]}
        onPress={handleSaveNote}
        disabled={!anotacao.trim() || saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.onPrimary} />
        ) : (
          <Text style={styles.saveNoteText}>Salvar Anotação</Text>
        )}
      </TouchableOpacity>

      {notes.length > 0 && (
        <View style={styles.notesListContainer}>
          <Text style={styles.notesListHeader}>Histórico Clínico:</Text>
          {notes.map((item) => (
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
      color: COLORS.onPrimary,
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
