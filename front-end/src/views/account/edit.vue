<template>
    <div>
        <h3>{{ $t('account.edit_account_page_title') }}</h3>
        <div class="account-edit">
            <form>
                <div class="account-edit-row">
                    <label>{{ $t('account.name') }}</label>
                    <div class="account-edit-row-content">
                        <input type="text" v-model="userInfo.fullname" :placeholder="$t('account.name_placeholder')">
                    </div>
                </div>
                <div class="account-edit-row">
                    <label>{{ $t('account.email') }}</label>
                    <div class="account-edit-row-content">
                        <input type="email"  v-model="userInfo.email" :placeholder="$t('account.email_placeholder')">
                    </div>
                </div>
                <div class="account-edit-row">
                    <label>{{ $t('account.role') }}</label>
                    <div class="account-edit-row-content">
                        <label>{{ userInfo.role === ROLE.ADMIN ? $t('common.admin_role') : $t('common.guest_role') }}</label>
                    </div>
                </div>
                <div class="account-edit-row">
                    <label></label>
                    <div class="account-edit-row-content">
                        <label @click="showChangePassword = !showChangePassword" class="toggle-change-password"><i :class="['fa', showChangePassword ? 'fa-angle-up' : 'fa-angle-down']"></i> Change password</label>
                    </div>
                </div>
                <div v-if="showChangePassword" class="account-edit-row">
                    <label>{{ $t('account.password_old') }}</label>
                    <div class="account-edit-row-content">
                        <input type="password" v-model="userInfo.password" :placeholder="$t('account.password_old_placeholder')">
                    </div>
                </div>
                <div v-if="showChangePassword" class="account-edit-row">
                    <label>{{ $t('account.password_new') }}</label>
                    <div class="account-edit-row-content">
                        <input type="password" v-model="userInfo.new_password" :placeholder="$t('account.password_new_placeholder')">
                    </div>
                </div>
                <div v-if="showChangePassword" class="account-edit-row">
                    <label></label>
                    <div class="account-edit-row-content">
                        <input type="password" v-model="userInfo.new_password_confirm" :placeholder="$t('account.password_new_placeholder_confirm')">
                    </div>
                </div>
                <div class="account-edit-row">
                    <label>{{ $t('account.avatar') }}</label>
                    <div class="account-edit-row-content">
                        <div class="avatar-input">
                            <img v-if="userInfo.avatr" :src="userInfo.avatr">
                            <input type="file">
                        </div>
                    </div>
                </div>
                <div class="account-edit-footer">
                    <button class="btn save-btn">{{ $t('common.save_btn') }}</button>
                    <button class="btn cancel-btn">{{ $t('common.cancel_btn') }}</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import { SERVER } from '../../helper/constant'
import generateAvatarUrlFromName from '../../helper/generateAvatarUrlFromName'
export default {
    data() {
        return {
            userInfo: {},
            showChangePassword: false,
            ROLE: SERVER.ROLE_OF_USER
        }
    },
    watch: {
        showChangePassword() {
            this.userInfo.password = this.userInfo.new_password = this.userInfo.new_password_confirm = ''
        }
    },
    created() {
        this.$store.dispatch('getUser').then(data => {
            this.userInfo = data.data
            this.userInfo.avatr = this.userInfo.avatr || generateAvatarUrlFromName(this.userInfo.fullname)
        })
    },
}
</script>

<style lang="scss" scoped>
.account-edit {
    width: 500px;
    max-width: 100%;
    padding: 10px;
    border: 1px darkgray solid;
    border-radius: 5px;
    margin: auto;

    &-row {
        width: 100%;
        display: flex;
        margin-top: 8px;
        label {
            width: 120px;
            text-align: right;
            padding-right: 10px;
        }
        &-content {
            width: calc(100% - 120px);
            input {
                width: 100%;
            }
            .avatar-input {
                width: 80px;
                height: 80px;
                border: 1px darkgray dashed;
                border-radius: 5px;
                position: relative;
                &:hover {
                    border-width: 3px;
                }
                input {
                    position: absolute;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    cursor: pointer;
                    &::-webkit-file-upload-button {
                        cursor: pointer;
                    }
                }
                img {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                }
            }
        }
        .toggle-change-password {
            font-size: 14px;
            cursor: pointer;
            &:hover {
                background-color: lightgray;
            }
        }
    }
    &-footer {
        text-align: center;
        padding-top: 10px;
        .btn {
            cursor: pointer;
            width: 70px;
            &.save-btn {
                background-color: #4CAF50;
                border: none;
                color: white;
            }
            &.cancel-btn {
                background-color: white;
                border: 1px solid #2196F3;
                margin-left: 10px;
            }
        }
    }
}
</style>