<template>
    <div class="config-container">
        <div>
            <label>Username</label>
            <input v-model="username" type="text" />
        </div>
        <m-button @click="sumit">Submit</m-button>
        <div>
            <input v-model="dateFormat" id="yyyy/mm/đd" name="dateFomart" value="yyyy/mm/dd" type="radio" />
            <label for="yyyy/mm/đd">yyyy/mm/dd</label>
        </div>
        <div>
            <input v-model="dateFormat" id="dd/mm/yyyy" name="dateFomart" value="dd/mm/yyyy" type="radio" />
            <label for="dd/mm/yyyy">dd/mm/yyyy</label>
        </div>
    </div>
</template>

<script>
import * as axiosRequest from '@/utils/axiosRequest'
import { config } from '@/main'
export default {
    data() {
        return {
            username: null,
            dateFormat: null,
        }
    },
    methods: {
        async getUserConfig() {
            const res = await axiosRequest.getRequest(`/User/${this.username}`)
            localStorage.setItem("config", JSON.stringify(res));
        },
        async sumit() {
            if (this.dateFormat) {
                await axiosRequest.putRequest(`/User/${this.username}`, {
                    DateFormat: this.dateFormat
                })
            }
            await this.getUserConfig()
            config.$format = JSON.parse(localStorage.getItem('config'))
        }
    },
}
</script>

<style scoped>
.config-container {
    display: block;
    padding: 32px;
}

div {
    display: flex;
}

div,
input,
label {
    font-size: 1.4rem;
    line-height: 2.2rem;
    background-color: unset !important;
}

input,
button {
    border: 1px solid green;
}
</style>