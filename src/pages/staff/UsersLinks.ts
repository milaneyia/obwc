import { defineComponent, h, PropType } from '@vue/runtime-core';
import { User } from '../../../shared/models';

export default defineComponent({
    props: {
        users: {
            type: Array as PropType<User[]>,
            required: true,
        },
    },

    setup (props) {
        return () => props.users.map((u, i) =>
            h(
                'span',
                [
                    h(
                        'a',
                        { href: `https://osu.ppy.sh/users/${u.osuId}`, target: '_blank' },
                        u.username
                    ),
                    (i < props.users.length - 1 ? ', ' : undefined),
                ]
            )
        );
    },
});
