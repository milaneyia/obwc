<template>
    <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Update team
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    />
                </div>
                <div v-if="teamProp" class="modal-body">
                    <div class="container">
                        <div class="row mb-2">
                            <div class="col-sm">
                                <input
                                    v-model="name"
                                    type="text"
                                    class="form-control"
                                    placeholder="Name..."
                                >

                                <button class="btn btn-sm btn-primary mt-2" @click="update">
                                    Update name
                                </button>
                            </div>
                        </div>

                        <hr>

                        <div class="row">
                            <div
                                v-for="user in users"
                                :key="user.id"
                                class="col-sm-12"
                            >
                                {{ user.username }}
                                <button
                                    class="btn btn-sm btn-danger me-2 mb-2"
                                    @click="removeUser(user.id)"
                                >
                                    Remove
                                </button>
                                <button
                                    class="btn btn-sm btn-danger me-2 mb-2"
                                    @click="transferOwnership(user.id)"
                                >
                                    Transfer Captain Role
                                </button>
                            </div>
                        </div>

                        <hr>

                        <div class="row">
                            <div class="col-sm">
                                <button class="btn btn-sm btn-danger" @click="removeTeam">
                                    Delete everything
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Team, User } from '../../shared/models';

export default defineComponent({
    name: 'StaffTeamUpdate',

    props: {
        teamProp: {
            type: Object as PropType<Team>,
            default: () => null,
        },
    },

    emits: [
        'update:team',
        'remove:team',
    ],

    data () {
        return {
            name: '',
            users: [] as User[],
        };
    },

    watch: {
        teamProp (team: Team | null) {
            this.name = team?.name || '';
            this.users = team?.users || [];
        },
    },

    methods: {
        async update () {
            const { data } = await this.$http.put<Team>(`/api/staff/teams/${this.teamProp.id}`, {
                name: this.name,
            });
            this.$emit('update:team', data);
            this.name = data.name;
        },

        async removeUser (userId: number) {
            if (!confirm('Remove user from the team?'))
                return;

            const { data } = await this.$http.put<Team>(`/api/staff/teams/${this.teamProp.id}/removeUser`, {
                userId,
            });
            this.$emit('update:team', data);
            this.users = data.users;
        },

        async transferOwnership (userId: number) {
            const { data } = await this.$http.put<Team>(`/api/staff/teams/${this.teamProp.id}/transferOwnership`, {
                userId,
            });
            this.$emit('update:team', data);
            this.users = data.users;
        },

        async removeTeam () {
            if (!confirm('This will delete all team related data (name, users, invitations), are you sure?'))
                return;

            await this.$http.delete(`/api/staff/teams/${this.teamProp.id}`);
            this.$emit('remove:team', this.teamProp.id);
        },
    },
});
</script>
