<script>
	import { onMount } from 'svelte';
	import { isDarkMode } from '../store/theme';

	import ThemeButton from '../components/theme.button.svelte';
	import { tw } from '../tw';

	let count = 0;

	const counterActions = {
		plus: () => {
			count += 1;
		},
		minus: () => {
			count -= 1;
		}
	};

	const header = tw.style({
		fontSize: 'text-3xl',
		fontWeight: 'font-bold',
		color: 'text-transparent',

		gradient: 'bg-gradient-to-l',
		gradientStart: 'from-red-600',
		gradientMiddle: 'via-amber-300',
		gradientEnd: 'to-amber-500',
		gradientMiddlePosition: 'via-50%',
		backgroundClip: 'bg-clip-text',

		'@dark': {
			gradientStart: 'dark:from-amber-300',
			gradientMiddle: 'dark:via-amber-600',
			gradientEnd: 'dark:to-red-400'
		}
	});

	const button = tw.rotary({
		base: {
			display: 'flex',
			alignItems: 'items-center',
			justifyContent: 'justify-center',
			padding: 'p-2',
			borderRadius: 'rounded-lg',
			backgroundColor: 'bg-white',
			'@dark': {
				backgroundColor: 'dark:bg-neutral-900'
			},
			borderWidth: 'border',
			borderBottomWidth: 'border-b-4',
			':hover': {
				borderBottomWidth: 'hover:border-b-[3.25px]'
			},
			':active': {
				opacity: 'active:opacity-50',
				transformScale: 'active:scale-95',
				transformTranslateY: 'active:translate-y-0.5',
				borderBottomWidth: 'active:border-b-[2px]'
			},
			transition: 'transition',
			transitionDuration: 'duration-75'
		},
		minus: {
			color: 'text-blue-700',
			borderColor: 'border-blue-700',
			'@dark': {
				color: 'dark:text-blue-300',
				borderColor: 'dark:border-blue-300',
				':hover': {
					color: 'dark:hover:text-blue-700',
					backgroundColor: 'dark:hover:bg-blue-300',
					borderColor: 'dark:hover:border-blue-700'
				}
			}
		},
		plus: {
			color: 'text-green-700',
			borderColor: 'border-green-700',
			'@dark': {
				color: 'dark:text-green-300',
				borderColor: 'dark:border-green-300',
				':hover': {
					color: 'dark:hover:text-green-700',
					backgroundColor: 'dark:hover:bg-green-300',
					borderColor: 'dark:hover:border-green-700'
				}
			}
		}
	});

	onMount(() => {
		const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
		isDarkMode.set(prefersDarkMode.matches);
		document.body.classList.add($isDarkMode ? 'dark' : 'light');

		const handleChange = () => isDarkMode.set(prefersDarkMode.matches);
		prefersDarkMode.addEventListener('change', handleChange);

		return () => {
			prefersDarkMode.removeEventListener('change', handleChange);
		};
	});
</script>

<ThemeButton />
<h1 class={header.class}>Counter: {count}</h1>
<div class="flex flex-row gap-2 items-center justify-between">
	<button type="button" class={button.class('minus')} on:click={counterActions.minus}>
		Minus
	</button>
	<button type="button" class={button.class('plus')} on:click={counterActions.plus}> Plus </button>
</div>

<style lang="postcss"></style>
