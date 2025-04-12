<template>
    <div class="card my-3">
        <div class="card-header">
            <h5 class="mb-0">Chat: {{ threadName }}</h5>
        </div>
        <div class="card-body">
            <div v-if="messages.length">
                <div v-for="(message, index) in messages" :key="index" class="p-0 text-start" :class="{
                    'human-card-outer': message.type === 'human',
                    'ai-card-outer': message.type === 'ai',
                }">
                    <div class="markdown-body" :class="{
                    'human-card': message.type === 'human',
                    'ai-card': message.type === 'ai',
                }" v-html="renderMarkdown(message)"></div>
                </div>

            </div>

            <textarea class="form-control mt-3" v-model="input" rows="3" placeholder="Enter your Packet..."></textarea>
            <button @click="send" class="btn btn-primary mt-2">Send</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { sendMessage, getHistory } from '../api';
import { marked } from 'marked';

const props = defineProps({ threadId: String, threadName: String });
const input = ref('');
const messages = ref([]);

const send = async () => {
    if (!input.value) return;
    const res = await sendMessage(props.threadId, input.value);
    messages.value.push({ content: input.value, type: 'human' });
    messages.value.push({ content: res.data.response, type: 'ai' });
    input.value = '';
};

const renderMarkdown = (text) => {
    return marked.parse(text.content);
};
const fetchHistory = async () => {
    try {
        const { data } = await getHistory(props.threadId);
        messages.value = data.chat_history?.checkpoint?.channel_values?.messages || [];
    } catch (error) {
        if (error.response?.status === 404) {
            messages.value = [];
        } else {
            console.error("Unexpected error:", error);
        }
    }
};
onMounted(async () => {
    await fetchHistory();
});
watch(
    () => props.threadId,
    async (newThreadId) => {
        if (newThreadId) {
            await fetchHistory();
        }
    },
    { immediate: true }
);
</script>
<style>

.human-card-outer, .ai-card-outer {
    max-width: 70%;
    padding: 10px;
    margin-bottom: 10px;
}
.human-card-outer {
    margin-left: auto;
}
.ai-card-outer {
    margin-right: auto;
    
}
.markdown-body.human-card {
    background-color: #d1ecf1;
    color: #0c5460;
    border-radius: 15px 15px 0 15px;
    padding: 10px;

}
.markdown-body.ai-card {
    background-color: #e2e3e5;
    color: #383d41;
    border-radius: 15px 15px 15px 0;
    padding: 10px;


}
.markdown-body ul {
    padding-left: 1.25rem;
}

.markdown-body li {
    margin-bottom: 0.3rem;
    list-style-type: disc;
}

.markdown-body code {
    background-color: #f1f1f1;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: monospace;
}

.markdown-body pre {
    background-color: #f8f9fa;
    padding: 10px;
    overflow-x: auto;
    border-radius: 4px;
}
</style>