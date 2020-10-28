<template>
    <div>
        <h3>{{ $t('account.edit_account_page_title') }}</h3>
        <div class="account-edit">
            <div class="account-edit-row">
                <label>{{ $t('account.name') }}</label>
                <div class="account-edit-row-content">
                    <input v-if="userInfo.fullname_being_edit" type="text" v-model="userInfo.fullname_edit"
                        :placeholder="$t('account.name_placeholder')">
                    <div v-if="!userInfo.fullname_being_edit">
                        <label>{{userInfo.fullname}}</label>
                        <i @click="showEdit('fullname')" class="fa fa-pencil-square-o edit-action"></i>
                    </div>
                    <div v-if="userInfo.fullname_being_edit" class="account-edit-row-content-action">
                        <button @click="submitEditInfo('fullname')"
                            class="submit-btn">{{ $t('common.save_btn') }}</button>
                        <button @click="cancelEdit('fullname')"
                            class="cancel-btn">{{ $t('common.cancel_btn') }}</button>
                    </div>
                </div>
            </div>
            <div class="account-edit-row">
                <label>{{ $t('account.email') }}</label>
                <div class="account-edit-row-content">
                    <input v-if="userInfo.email_being_edit" type="email" v-model="userInfo.email_edit"
                        :placeholder="$t('account.email_placeholder')">
                    <div v-if="!userInfo.email_being_edit">
                        <label>{{userInfo.email}}</label>
                        <i @click="showEdit('email')" class="fa fa-pencil-square-o edit-action"></i>
                    </div>
                    <div v-if="userInfo.email_being_edit" class="account-edit-row-content-action">
                        <button @click="submitEditInfo('email')" class="submit-btn">{{ $t('common.save_btn') }}</button>
                        <button @click="cancelEdit('email')" class="cancel-btn">{{ $t('common.cancel_btn') }}</button>
                    </div>
                </div>
            </div>
            <div class="account-edit-row">
                <label>{{ $t('account.role') }}</label>
                <div class="account-edit-row-content">
                    <label>{{ userInfo.role === ROLE.ADMIN ? $t('common.admin_role') : $t('common.guest_role') }}</label>
                </div>
            </div>
            <div class="account-edit-row">
                <label>{{ $t('account.password') }}</label>
                <div class="account-edit-row-content">
                    <input v-if="userInfo.password_being_edit" type="password" v-model="userInfo.password_edit"
                        :placeholder="$t('account.password_old_placeholder')">
                    <input v-if="userInfo.password_being_edit" type="password" v-model="userInfo.new_password_edit"
                        :placeholder="$t('account.password_new_placeholder')">
                    <input v-if="userInfo.password_being_edit" type="password"
                        v-model="userInfo.new_password_confirm_edit"
                        :placeholder="$t('account.password_new_placeholder_confirm')">
                    <div v-if="!userInfo.password_being_edit">
                        <label>********</label>
                        <i @click="showEdit('password', 'new_password', 'new_password_confirm')"
                            class="fa fa-pencil-square-o edit-action"></i>
                    </div>
                    <div v-if="userInfo.password_being_edit" class="account-edit-row-content-action">
                        <button @click="submitEditInfo('password', 'new_password', 'new_password_confirm')"
                            class="submit-btn">{{ $t('common.save_btn') }}</button>
                        <button @click="cancelEdit('password')"
                            class="cancel-btn">{{ $t('common.cancel_btn') }}</button>
                    </div>
                </div>
            </div>
            <div class="account-edit-row">
                <label>{{ $t('account.avatar') }}</label>
                <div class="account-edit-row-content">
                    <div class="avatar-input">
                        <img v-if="userInfo.avatr" :src="userInfo.avatr">
                        <input ref="avatar" @change="confirmChangeAvatar()" type="file">
                    </div>
                </div>
            </div>
        </div>
        <modalConfirm @cancel="confirmCancel()" @ok="confirmOk()" :message="confirmMsg" ref="modal-confirm" />
    </div>
</template>
<script>
import { SERVER } from '../../helper/constant'
import generateAvatarUrlFromName from '../../helper/generateAvatarUrlFromName'
import modalConfirm from '../../components/modalConfirm'
export default {
    components: {
        modalConfirm,
    },
    data() {
        return {
            userInfo: {},
            ROLE: SERVER.ROLE_OF_USER,
            confirmType: null,
            confirmMsg: null,
            avatarFile: null,
        }
    },
    created() {
        this.$store.dispatch('getUser').then(data => {
            this.userInfo = data.data
            this.userInfo.avatr = this.userInfo.avatr || generateAvatarUrlFromName(this.userInfo.fullname)
        })
    },
    methods: {
        showEdit(...fields) {
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i]
                this.$set(this.userInfo, field + "_edit", this.userInfo[field])
                this.$set(this.userInfo, field + "_being_edit", true)
            }
        },
        cancelEdit(...fields) {
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i]
                this.$set(this.userInfo, field + "_edit", this.userInfo[field])
                this.$set(this.userInfo, field + "_being_edit", false)
            }
        },
        confirmChangeAvatar() {
            this.avatarFile = this.$refs.avatar.files[0]
            this.confirmType = 'editAvatar'
            this.confirmMsg = this.$t('account.edit_avatar_confirm_msg')
            this.$refs['modal-confirm'].showModal()
        },
        confirmCancel() {
            this.confirmType = null
            this.confirmMsg = null
            this.avatarFile = null
        },
        confirmOk() {
            switch (this.confirmType) {
                case 'editAvatar':
                    this.submitEditInfo('avatar')
                    break;
            }
            this.confirmCancel()
        },
        submitEditInfo(...fields) {
            let formData = new FormData()
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                switch (field) {
                    case 'avatar':
                        formData.append(field, this.avatarFile)
                        break;
                    default:
                        if (['fullname', 'email', 'password', 'new_password', 'new_password_confirm'].indexOf(field) !== -1) {
                            formData.append(field, this.userInfo[field + '_edit'])
                        }
                        break;
                }
            }
            this.$store.dispatch('updateAccountInfo', formData)
        }
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

                &:nth-child(n + 2) {
                    margin-top: 10px;
                }
            }

            .edit-action {
                cursor: pointer;
                margin-left: 5px;

                &:hover {
                    color: orangered;
                }
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

            &-action {
                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    margin-right: 10px;
                    border-radius: 5px;
                    outline: none;

                    &:hover {
                        text-decoration-line: underline;
                    }

                    &.submit-btn {
                        color: orangered;
                    }

                    &.cancel-btn {
                        color: blue;
                    }
                }
            }
        }
    }
}
</style>