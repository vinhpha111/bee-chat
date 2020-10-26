<template>
    <div id="app">
        <div class="chat-main">
            <div :class="['left-bar', { show: isShowSideBar }]">
                <img
                    @click="isShowSideBar = !isShowSideBar"
                    class="sidebar-toggle-btn"
                    src="./assets/images/menu-button-sidebar.png"
                />
                <LeftSideBar />
            </div>
            <div :class="['right-bar w3-white', {'has-sub-thread': $store.getters['subThread/getType']}]">
                <div class="main-thread">
                    <router-view :key="$route.fullPath" />
                </div>
                <sub-thread v-if="$store.getters['subThread/getType']" />
                <loading-screen
                    position="absolute"
                    v-if="$store.getters.getLoadingView"
                />
            </div>
        </div>
        <loading-screen v-if="$store.getters.getLoading" />
    </div>
</template>

<script>
import LoadingScreen from "./components/LoadingScreen";
import LeftSideBar from "./components/LeftSideBar";
import SubThread from "./components/subThread/index"
export default {
    components: {
        LoadingScreen,
        LeftSideBar,
        SubThread
    },
    data() {
        return {
            isShowSideBar: false,
        };
    }
};
</script>

<style lang="scss">
@import "./css/main.module.scss";
@import "./css/text-editor.module.scss";
</style>
