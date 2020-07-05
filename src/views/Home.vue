<template>
  <div class="home">
        <el-menu
            class="top-navbar"
            mode="horizontal"
            background-color="#0f0f0f"
            text-color="#eee"
            active-text-color="#b91d1d">
            <el-menu-item index="signIn">
                <div @click="signInClicked" v-if="!user.photoURL" class="mt-1">
                    Sign in
                </div>
                <div v-else>
                    <el-dropdown trigger="click">
                        <img :src="user.photoURL" class="user-photo"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  divided>
                                <div @click="signOutClicked">
                                    <font-awesome-icon :icon="['fas', 'sign-out-alt']"/>
                                    Sign out
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-menu-item>
        </el-menu>
  </div>
</template>

<script>
    import { signIn, firebase, signOut, db } from '../Common/firebase';
    export default {
        name: "Home",
        data() {
            return {
                activeNavItem: ''
            }
        },
        methods: {
            signInClicked() {
                signIn();
            },
            signOutClicked() {
                signOut();
            },
        },
        computed: {
            user() {
                return this.$store.getters.user;
            }
        }
    };
</script>

<style lang="less" scoped>
    .user-photo {
        height: 2em;
        width: auto;
        border-radius: 100%;
    }
</style>