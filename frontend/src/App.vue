<script setup>
import { onMounted } from 'vue';
import { useAutenticacion } from './composables/useAutenticacion';
import LoginView from './views/LoginView.vue';
import Panel from './views/Panel.vue';

const {inicializarAuth} = useAutenticacion();

onMounted (() => {
    inicializarAuth()
})
</script>

<template>
    <!-- <LoginView /> -->
    <!-- <Panel/>  -->
    <router-view/>
</template>