<template>
    <div>
        <h3>{{ $t('account.edit_account_page_title') }}</h3>
        <div class="account-edit">
            <div class="account-edit-row">
                <label>{{ $t('account.name') }}</label>
                <div class="account-edit-row-content">
                    <input v-if="userInfo.fullname_being_edit" type="text" v-model="userInfo.fullname_edit"
                        :placeholder="$t('account.name_placeholder')">
                    <div v-for="(error, index) in errors" :key="index">
                        <p v-if="error.param === 'fullname'" class="error">{{$t(error.msg, {max: 20})}}</p>
                    </div>
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
                    <div v-for="(error, index) in errors" :key="index">
                        <p v-if="error.param === 'email'" class="error">{{$t(error.msg, {max: 20})}}</p>
                    </div>
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
                    <div>
                        <div v-for="(error, index) in errors" :key="index">
                            <p v-if="error.param === 'password'" class="error">{{$t(error.msg)}}</p>
                        </div>
                    </div>
                    <input v-if="userInfo.password_being_edit" type="password" v-model="userInfo.new_password_edit"
                        :placeholder="$t('account.password_new_placeholder')">
                    <div>
                        <div v-for="(error, index) in errors" :key="index">
                            <p v-if="error.param === 'new_password'" class="error">{{$t(error.msg)}}</p>
                        </div>
                    </div>
                    <input v-if="userInfo.password_being_edit" type="password"
                        v-model="userInfo.new_password_confirm_edit"
                        :placeholder="$t('account.password_new_placeholder_confirm')">
                    <div>
                        <div v-for="(error, index) in errors" :key="index">
                            <p v-if="error.param === 'new_password_confirm'" class="error">{{$t(error.msg)}}</p>
                        </div>
                    </div>
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
                        <img v-if="userInfo.avatar" :src="userInfo.avatar">
                        <input id="avatar_file" ref="avatar" @change="confirmChangeAvatar()" type="file" accept="image/x-png,image/gif,image/jpeg">
                    </div>
                    <div v-for="(error, index) in errors" :key="index">
                        <p v-if="error.param === 'avatar'" class="error">{{$t(error.msg, {size: "2Mb"})}}</p>
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
            errors : []
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.userInfo = {}
            this.ROLE = SERVER.ROLE_OF_USER
            this.confirmType = null
            this.confirmMsg = null
            this.avatarFile = null
            this.errors = []
            this.$store.dispatch('getUser').then(data => {
                this.userInfo = data.data
                this.userInfo.avatar = this.userInfo.avatar_path || generateAvatarUrlFromName(this.userInfo.fullname)
            })
        },
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
                this.errors = this.errors.filter(err => err.param !== field)
                this.$set(this.userInfo, field + "_edit", this.userInfo[field])
                this.$set(this.userInfo, field + "_being_edit", false)
            }
        },
        confirmChangeAvatar() {
            if (this.validAvatarInput()) {
                this.avatarFile = this.$refs.avatar.files[0]
                this.confirmType = 'editAvatar'
                this.confirmMsg = this.$t('account.edit_avatar_confirm_msg')
                this.$refs['modal-confirm'].showModal()
            }
        },
        validAvatarInput() {
            const file = this.$refs.avatar.files[0]
            if (file.size >= 1024*1024*2) {
                this.errors = [{
                    param: "avatar",
                    msg: "validation.max_size_avatar"
                }]
                return false
            }
            return true
        },
        confirmCancel() {
            this.confirmType = null
            this.confirmMsg = null
            this.avatarFile = null
            document.getElementById('avatar_file').value = ''
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
                            formData.append(field, this.userInfo[field + '_edit'] || '')
                        }
                        break;
                }
            }
            this.$store.commit('setLoading', true)
            this.$store.dispatch('updateAccountInfo', formData).then((res) => {
                this.$store.commit('setLoading', false)
                this.$store.commit('setUserInfo', res.data)
                this.init()
            }).catch(err => {
                if (err.response.status === 422) {
                    this.errors = err.response.data.errors   
                }
                this.$store.commit('setLoading', false)
            })
        }
    },
}
</script>