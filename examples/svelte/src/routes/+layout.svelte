<script>
	import '../app.css';
	import { tw } from '../tw';

	const layout = tw.style({
		position: 'relative',

		display: 'flex',
		flexDirection: 'flex-col',
		alignItems: 'items-center',
		justifyContent: 'justify-center',
		gap: 'gap-7',

		height: 'h-screen',
		minHeight: 'min-h-screen',

		paddingY: 'py-10',
		'@dark': {
			backgroundColor: 'dark:bg-neutral-900'
		}
	});
</script>

<main class={layout.class}>
	<slot />
</main>
