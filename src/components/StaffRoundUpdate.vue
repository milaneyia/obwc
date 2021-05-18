<template>
    <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Update Round
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    />
                </div>
                <div v-if="round" class="modal-body">
                    <div class="container">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label>Submissions Start Date</label>
                                    <input
                                        v-model="round.submissionsStartedAt"
                                        type="datetime-local"
                                        class="form-control"
                                    >
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label>Submissions End Date</label>
                                    <input
                                        v-model="round.submissionsEndedAt"
                                        type="datetime-local"
                                        class="form-control"
                                    >
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label>Judging Start Date</label>
                                    <input
                                        v-model="round.judgingStartedAt"
                                        type="datetime-local"
                                        class="form-control"
                                    >
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label>Judging End Date</label>
                                    <input
                                        v-model="round.judgingEndedAt"
                                        type="datetime-local"
                                        class="form-control"
                                    >
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label>Results Date</label>
                                    <input
                                        v-model="round.resultsAt"
                                        type="datetime-local"
                                        class="form-control"
                                    >
                                </div>
                            </div>
                        </div>

                        <hr>

                        <div class="row mb-2">
                            <div class="col-sm">
                                <p>Judges</p>

                                <div v-for="(judgeToRound, i) in round.judgeToRounds" :key="'judgeToRound-' + i">
                                    {{ judgeToRound.user.username }} - {{ getJudgingTypeName(judgeToRound.judgingTypeId) }}
                                    <a href="#" @click.prevent="removeJudge(i)">
                                        <i class="fas fa-times text-danger" />
                                    </a>
                                </div>

                                <div class="input-group">
                                    <input
                                        v-model="userKeyword"
                                        type="text"
                                        placeholder="username/id"
                                        class="form-control"
                                        @keyup.enter="search"
                                    >
                                    <button class="btn btn-outline-primary" @click="search">
                                        <i class="fas fa-search" />
                                    </button>
                                </div>

                                <div
                                    v-for="user in users"
                                    :key="user.id"
                                    class="form-check form-check-inline"
                                >
                                    <input
                                        :id="'user-' + user.id"
                                        v-model="selectedUser"
                                        class="form-check-input"
                                        type="radio"
                                        :value="user"
                                    >
                                    <label
                                        class="form-check-label"
                                        :for="'user-' + user.id"
                                    >
                                        {{ user.username }}
                                    </label>
                                </div>

                                <div class="form-group">
                                    <div class="form-check form-check-inline">
                                        <input
                                            id="mappersPick"
                                            v-model="judgingTypeId"
                                            class="form-check-input"
                                            type="radio"
                                            :value="mappersPick"
                                        >
                                        <label class="form-check-label" for="mappersPick">Mapper</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input
                                            id="playersPick"
                                            v-model="judgingTypeId"
                                            class="form-check-input"
                                            type="radio"
                                            :value="playersPick"
                                        >
                                        <label class="form-check-label" for="playersPick">Player</label>
                                    </div>
                                </div>

                                <button class="btn btn-success" @click="addJudge">
                                    Add
                                </button>
                            </div>
                        </div>

                        <hr>

                        <div class="row">
                            <div class="col-sm">
                                <p>Songs</p>

                                <div v-for="(song, i) in round.songs" :key="'song-' + i">
                                    {{ song.title }} - {{ song.link }}
                                    <a href="#" @click.prevent="removeSong(i)">
                                        <i class="fas fa-times text-danger" />
                                    </a>
                                </div>

                                <input
                                    v-model="title"
                                    type="text"
                                    placeholder="title"
                                    class="form-control mb-2"
                                >
                                <input
                                    v-model="link"
                                    type="text"
                                    placeholder="link"
                                    class="form-control mb-2"
                                >

                                <button class="btn btn-success" @click="addSong">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="update"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CreateRound } from '../../shared/integration';
import { JUDGING_TYPE, Round, User } from '../../shared/models';

export default defineComponent({
    name: 'StaffRoundUpdate',

    props: {
        roundProp: {
            type: Object as PropType<Round>,
            default: () => null,
        },
    },

    emits: [
        'update:round',
    ],

    data () {
        return {
            round: null as CreateRound | null,

            userKeyword: '',
            users: [] as User[],
            selectedUser: null  as User | null,
            judgingTypeId: JUDGING_TYPE.Mappers,

            title: '',
            link: '',
        };
    },

    computed: {
        mappersPick (): number {
            return JUDGING_TYPE.Mappers;
        },

        playersPick (): number {
            return JUDGING_TYPE.Players;
        },
    },

    watch: {
        roundProp (round: Round | null) {
            if (!round) {
                this.round = null;

                return;
            }

            this.round = {
                submissionsStartedAt: this.$formatDate(round.submissionsStartedAt) as any,
                submissionsEndedAt: this.$formatDate(round.submissionsEndedAt) as any,
                judgingStartedAt: this.$formatDate(round.judgingStartedAt) as any,
                judgingEndedAt: this.$formatDate(round.judgingEndedAt) as any,
                resultsAt: this.$formatDate(round.resultsAt) as any,
                judgeToRounds: [
                    ...round.judgeToRounds,
                ],
                songs: [
                    ...round.songs,
                ],
            };
        },
    },

    methods: {
        getJudgingTypeName (type: number) {
            return JUDGING_TYPE[type];
        },

        async search () {
            const { data } = await this.$http.get('/api/users?user=' + this.userKeyword);
            this.users = data;
        },

        addJudge () {
            if (!this.round) return;

            if (!this.selectedUser) {
                return this.$store.dispatch('addToastMessage', 'Select an user');
            }

            this.round.judgeToRounds.push({
                user: this.selectedUser,
                judgingTypeId: this.judgingTypeId,
            });
            this.users = [];
        },

        removeJudge (index: number) {
            this.round?.judgeToRounds.splice(index, 1);
        },

        addSong () {
            if (!this.round) return;

            if (!this.title || !this.link) {
                return this.$store.dispatch('addToastMessage', 'Fill the blanks');
            }

            this.round.songs.push({
                title: this.title,
                link: this.link,
            });
        },

        removeSong (index: number) {
            this.round?.songs.splice(index, 1);
        },

        async update () {
            const { data } = await this.$http.put<Round>(`/api/staff/rounds/${this.roundProp.id}`, this.round);
            this.$emit('update:round', data);
        },
    },
});
</script>
