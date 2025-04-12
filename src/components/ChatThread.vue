<template>
    <div class="container mt-4">
      <h2>Chat Threads</h2>
      <ul class="list-group mb-3">
        <li
          v-for="thread in threads"
          :key="thread.thread_id"
          @click="select(thread.thread_id, thread.thread_name? thread.thread_name : '')"
          class="list-group-item list-group-item-action"
          style="cursor: pointer"
        >
          {{ thread.thread_name || `Thread ${thread.thread_id}` }}
        </li>
      </ul>
      <input v-model="newThreadName" type="text" class="form-control mb-3" placeholder="New Thread Name" />
      <button class="btn btn-success" @click="create" :disabled="!newThreadName">+ New Thread</button>
  
      <ChatBox v-if="selectedId" :thread-id="selectedId" :thread-name="selectedName" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getThreads, createThread } from '../api';
  import ChatBox from './ChatBox.vue';
  
  const threads = ref([]);
  const selectedId = ref(null);
  const selectedName = ref(null);
  const newThreadName = ref('');
  
  const load = async () => {
    const { data } = await getThreads();
    threads.value = data;
  };
  
  const create = async () => {
    const { data } = await createThread({
        thread_name: newThreadName.value,
    });
    threads.value.push({thread_id:data, thread_name: newThreadName.value});
    selectedName.value = newThreadName.value;
    newThreadName.value = '';
    selectedId.value = data.thread_id;
  };
  
  const select = (id, name) => {
    selectedId.value = id;
    if(name){
      selectedName.value = name;
    }
  };
  
  onMounted(load);
  </script>
  