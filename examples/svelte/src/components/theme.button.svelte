<script>
	import { isDarkMode } from '../store/theme';
	import { tw } from '../tw';

	const button = tw.toggle({
		base: {
			position: 'absolute',
			top: 'top-4',
			right: 'right-4',

			display: 'flex',
			alignItems: 'items-center',
			justifyContent: 'justify-center',
			paddingX: 'px-2',
			paddingY: 'py-1',
			borderBottomWidth: 'border-b',
			borderColor: 'border-transparent',
			backgroundColor: 'bg-transparent',
			':hover': {
				opacity: 'hover:opacity-75'
			},
			transition: 'transition'
		},
		truthy: {
			color: 'text-white',
			':hover': {
				borderColor: 'hover:border-gray-200'
			}
		},
		falsy: {
			color: 'text-black',
			':hover': {
				borderColor: 'hover:border-gray-800'
			}
		}
	});
</script>

<button
	class={button.class($isDarkMode)}
	on:click={() => {
		const { body } = document;
		body.classList.remove($isDarkMode ? 'dark' : 'light');
		body.classList.add($isDarkMode ? 'light' : 'dark');

		isDarkMode.update((mode) => {
			return !mode;
		});
	}}
>
	{$isDarkMode ? 'light' : 'dark'}
</button>
