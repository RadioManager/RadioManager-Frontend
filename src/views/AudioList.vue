<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAudioRecordingStore } from '@/stores/audio_recording'
import { getUserById } from '@/services/user'

const userStore = useUserStore()
const audioStore = useAudioRecordingStore()

const profile = computed(() => userStore.profile || {})
const isAdmin = computed(() => profile.value.role === 'ADMIN')
const recordings = computed(() => audioStore.recordings)

const statuses = ['APPROVED', 'PENDING', 'REJECTED']

const userNames = ref({})

const statusLabels = {
  APPROVED: 'Одобрено',
  PENDING:  'В ожидании',
  REJECTED: 'Отклонено'
};

async function loadRecordings() {
  if (isAdmin.value) {
    await audioStore.loadAllRecordings()
  } else {
    await audioStore.loadRecordingsByUser(profile.value.id)
  }
  if (isAdmin.value) {
    const uniqueIds = [...new Set(audioStore.recordings.map(item => item.recording.userId))]
    for (const id of uniqueIds) {
      try {
        const user = await getUserById(id)
        userNames.value[id] = `${user.name} ${user.surname} ID:${user.id}`
      } catch (e) {
        userNames.value[id] = 'Ошибка загрузки'
      }
    }
  }
}

onMounted(() => {
  loadRecordings()
})

async function onFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    await audioStore.createRecording(file)
    await loadRecordings()
  }
  event.target.value = ''
}

function getFileName(path) {
  return path.split('/').pop()
}

async function onStatusChange(id, status) {
  try {
    await audioStore.updateRecordingStatus(id, status)
  } catch (e) {
    alert('Ошибка при обновлении статуса: ' + (e.response?.data || e.message))
  }
}

function confirmDelete(id) {
  if (confirm('Вы уверены, что хотите удалить запись?')) {
    onDelete(id)
  }
}

async function onDelete(id) {
  try {
    await audioStore.deleteRecording(id)
    await loadRecordings()
  } catch (e) {
    alert('Ошибка при удалении: ' + (e.response?.data || e.message))
  }
}
</script>

<template>
  <div class="page-wrapper">
    <h1 class="title">Аудиозаписи</h1>

    <div class="form-group">
      <label for="fileInput" class="submit-button">Добавить запись</label>
      <input
          id="fileInput"
          type="file"
          accept="audio/mp3"
          @change="onFileSelect"
          hidden
      />
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th>Название файла</th>
          <th>Цена (₽)</th>
          <th v-if="isAdmin">Пользователь</th>
          <th>Статус</th>
          <th>Прослушать</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in recordings" :key="item.recording.id">
          <td>{{ getFileName(item.recording.filePath) }}</td>
          <td>{{ item.recording.cost.toFixed(2) }}</td>
          <td v-if="isAdmin">{{ userNames[item.recording.userId] || '...' }}</td>
          <td>
            <select
                class="styled-select"
                v-if="isAdmin"
                v-model="item.recording.approvalStatus"
                @change="onStatusChange(item.recording.id, item.recording.approvalStatus)"
            >
              <option v-for="s in statuses" :key="s" :value="s">{{ statusLabels[s] }}</option>
            </select>
            <span v-else>{{ statusLabels[item.recording.approvalStatus] }}</span>
          </td>
          <td>
            <audio
                controls
                :src="`data:audio/mp3;base64,${item.fileContentBase64}`"
            ></audio>
          </td>
          <td>
            <button class="cancel-button" @click="confirmDelete(item.recording.id)">
              Удалить
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <p v-if="recordings.length === 0" class="no-data">Нет записей</p>
    </div>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-top: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid var(--color-border);
}

th, td {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  text-align: left;
  font-size: 1rem;
  color: var(--color-heading);
}

/* Выделяем заголовки */
th {
  font-weight: 600;
  color: var(--color-heading);
  background-color: var(--color-background-soft);
}

/* Кнопка «Добавить запись» (label-for-file) */
.submit-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary-button);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: var(--color-primary-button-hover);
}

/* Кнопка удаления */
.cancel-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-danger-button);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}
.cancel-button:hover {
  background-color: var(--color-danger-button-hover);
}

.no-data {
  text-align: center;
  margin-top: 1rem;
  color: var(--color-heading);
}
</style>