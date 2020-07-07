<template>
  <div class="home">
        <div class="app-name">
            PROTOTYPE
        </div>
        <el-menu
            class="top-navbar"
            mode="horizontal"
            background-color="#0f0f0f"
            text-color="#eee"
            active-text-color="#b91d1d">
            <el-menu-item index="signIn menu-item-nobg" class="user-icon">
                <div @click="signInClicked" v-if="!user.photoURL" class="mt-1">
                    Sign in
                </div>
                <div v-else>
                    <el-dropdown trigger="click">
                        <img :src="user.photoURL" class="user-photo"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
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
        <div class="main-container">
            <input class="upload-demo el-button el-button--info el-button--mini" id="s3Upload" type="file" accept="video/*"/>
            <el-button size="small" type="success" @click="uploadFile2" :loading="isUploading">
                {{getUploadButtonText}}
            </el-button>
            <div class="el-upload__tip upload-demo" slot="tip">video files will be converted to 480p 30fps</div>
            <el-progress :percentage="uploadProgress" v-if="isUploading"></el-progress>
            <!-- <input class="upload-demo" id="s3Upload" type="file" accept="video/*"/>
            <el-button size="small" type="success" @click="uploadFile">upload to server</el-button> -->
            <div class="video-grid">
                <div v-for="video in files" :key="video.Key">
                    <div class="video-container">
                        <video
                            :src="`https://s3-${process.env.VUE_APP_AWS_REGION}.amazonaws.com/${process.env.VUE_APP_AWS_BUCKET_NAME}/${video.Key}`"
                            controls loop autoplay muted/>
                        <div style="margin:1em;">
                            <div class="name-text">{{video.Key.replace('prototype/', '')}}</div>
                            <span class="size-text">{{formatBytes(video.Size)}}</span>
                            <el-button style="margin-left: 10px; float:right;" size="small" type="danger" @click="deleteFile(video.Key)">
                                <font-awesome-icon :icon="['far', 'trash-alt']"/>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
    import { signIn, firebase, signOut, db } from '../Common/firebase';
    import { getVideoById, getVideos } from '../Common/dynamodb';
    import { getFiles, uploadObject, deleteObject } from '../Common/s3';
    import axios from 'axios';
    import { sortBy } from 'lodash';
    import { formatBytes } from '../Common/utill';

    export default {
        name: "Home",
        data() {
            return {
                activeNavItem: '',
                videoUrl: '',
                videos: [],
                files: [],
                process: {
                    env: process.env
                },
                isUploading: false,
                isEncoding: false,
                uploadProgress: 0,
                formatBytes,
            }
        },
        async created() {
            this.loadData();
        },
        methods: {
            async loadData() {
                // const videos = await getVideos();
                // this.videos = videos;

                const filesRes = await getFiles();
                this.files = filesRes?.Contents || [];
                this.files = this.files.filter(file => file.Key.split('/')[1].length);
                this.files = sortBy(this.files, ({LastModified}) => {
                    const time = new Date(LastModified);
                    return -time.getTime();
                })
            },
            async uploadFile2() {
                const files = document.getElementById('s3Upload').files;
                const file = files[0];
                var formData = new FormData();
                formData.append("file", file);
                this.isUploading = true;
                try {
                    const res = await axios.post(`${window.location.protocol}//${window.location.hostname}:3000/fileupload`,
                        formData,
                        {
                            onUploadProgress: (progressEvent) => {
                                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                                if (percentCompleted >= 100) {
                                    this.isEncoding = true;
                                }
                                this.uploadProgress = percentCompleted;
                            },
                            transformResponse: (data) => {
                                return data;
                            },
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    this.loadData();
                    this.$message({
                        message: 'File has been uploaded successfully',
                        type: 'success'
                    });
                } catch(e) {
                    console.log(e);
                } finally {
                    this.isEncoding = false;
                    this.isUploading = false;
                    this.uploadProgress = 0;
                }
            },
            async uploadFile() {
                const files = document.getElementById('s3Upload').files;
                const file = files[0];
                const res = await uploadObject(file);
                this.loadData();
            },
            async deleteFile(key) {
                const res = await deleteObject(key);
                this.loadData();
            },
            signInClicked() {
                signIn();
            },
            signOutClicked() {
                signOut();
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
        },
        computed: {
            user() {
                return this.$store.getters.user;
            },
            getUploadButtonText() {
                if (this.isEncoding) {
                    return 'Encoding video';
                } else if (this.isUploading) {
                    return 'Uploading';
                }
                return 'Upload';
            }
        }
    };
</script>

<style lang="less" scoped>
    @import '../Assets/Styles/main.less';
    .user-photo {
        height: 2em;
        width: auto;
        border-radius: 100%;
    }
    .video-grid {
        display: flex;
        flex-direction: row;
        padding: 1em;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .s3-files {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1em;
    }
    .s3-file {
        padding: 0.5em;
    }
    .upload-demo {
        margin: 1em 2em 0 6em !important;
    }
    .video-container {
        display: flex;
        flex-direction: column;
        padding: 1em;
        margin: 1em;
        width: 95%;
        background-color: #161616;
        border-radius: 0.3em;
    }
    video {
        width: 100%;
        max-height: 20em;
        object-fit: contain;
        background-color: #070707;
        border-radius: 0.3em;
    }
    /deep/ .el-progress-bar__inner {
        background-color: rgb(66, 175, 66);
    }
    /deep/ .el-progress {
        width: 26em;
        margin-left: 4.5em;
        margin-top: 0.5em;
    }
    .size-text {
        font-size: 0.8em;
        line-height: 2em;
        font-weight: 600;
    }
    .name-text {
        text-transform: capitalize;
        font-weight: 500;
        max-width: 350px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .user-icon {
        float: right !important;
        right: 4em;
    }
    .top-navbar {
        box-shadow: 0px -6px 10px 7px rgba(148, 148, 148, 0.18);
        position: fixed;
        width: 100%;
        z-index: 100;
        top: 0;
    }
    .main-container {
        margin-top: 4em;
    }
    .el-menu-item:hover.menu-item-nobg {
        background-color: #0f0f0f !important;
        border: 0 !important;
    }
    .el-menu-item.menu-item-nobg {
        border: 0 !important;
    }
    .el-button {
        color: black;
        font-weight: 600 !important;
    }
    .app-name {
        position: fixed;
        z-index: 101;
        top: 0.4em;
        left: 47%;
        font-size: 1.4em;
        background-color: rgb(80, 80, 80);
        color: black;
        padding: 0.3em 0.7em;
        border-radius: 0.3em;
        font-weight: 600;
    }
</style>
