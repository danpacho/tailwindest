<script>
	import { wind } from 'tailwindest';
	import '../app.css';
	const layout = wind({
		position: 'relative',

		display: 'flex',
		flexDirection: 'flex-col',
		alignItems: 'items-center',
		justifyContent: 'justify-center',
		gap: 'gap-10',

		height: 'h-full',
		minHeight: 'min-h-max',

		paddingY: 'py-10',
		'@dark': {
			backgroundColor: 'dark:bg-neutral-900'
		},
		transition: 'transition'
	}).class();
</script>

<main class={layout}>
	<slot />
</main>
