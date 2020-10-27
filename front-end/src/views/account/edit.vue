<template>
    <div>
        <h1>Account edit page</h1>
        <div class="account-edit">
            <form>
                <div class="account-edit-row">
                    <label>Name</label>
                    <div class="account-edit-row-content">
                        <input type="text" placeholder="Name">
                    </div>
                </div>
                <div class="account-edit-row">
                    <label>Email</label>
                    <div class="account-edit-row-content">
                        <input type="email" placeholder="Email">
                    </div>
                </div>
                <div class="account-edit-row">
                    <label>Avatar</label>
                    <div class="account-edit-row-content">
                        <div class="avatar-input">
                            <input type="file">
                        </div>
                    </div>
                </div>
                <div class="account-edit-footer">
                    <button class="btn save-btn">Save</button>
                    <button class="btn cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {

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
            width: 80px;
        }
        &-content {
            width: calc(100% - 80px);
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
                background-color: lightgreen;
                border: 1px solid green;
            }
            &.cancel-btn {
                background-color: white;
                border: 1px solid lightgray;
                margin-left: 10px;
            }
        }
    }
}
</style>