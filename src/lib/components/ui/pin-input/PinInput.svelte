<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		value?: string;
		length?: number;
		disabled?: boolean;
		error?: boolean | string;
		onComplete?: (pin: string) => void;
		autofocus?: boolean;
	}

	let {
		value = $bindable(""),
		length = 6,
		disabled = false,
		error = false,
		onComplete,
		autofocus = false,
	}: Props = $props();

	let inputs: HTMLInputElement[] = [];

	let digits = $derived.by(() => {
		const arr = new Array(length).fill("");
		const clean = (value || "").replace(/\D/g, "").slice(0, length);
		for (let i = 0; i < clean.length; i++) {
			arr[i] = clean[i];
		}
		return arr;
	});

	function handleInput(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const char = target.value.replace(/\D/g, "").slice(-1);

		const current = (value || "").replace(/\D/g, "").split("");
		current[index] = char;
		const updated = current.join("").slice(0, length);
		value = updated;

		if (char && index < length - 1) {
			inputs[index + 1]?.focus();
		}

		if (updated.length === length && !updated.includes("")) {
			onComplete?.(updated);
		}
	}

	function handleKeyDown(index: number, e: KeyboardEvent) {
		if (e.key === "Backspace") {
			if (!digits[index] && index > 0) {
				inputs[index - 1]?.focus();
			}
		} else if (e.key === "ArrowLeft" && index > 0) {
			inputs[index - 1]?.focus();
		} else if (e.key === "ArrowRight" && index < length - 1) {
			inputs[index + 1]?.focus();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData("text") || "";
		const clean = pasted.replace(/\D/g, "").slice(0, length);
		if (!clean) return;
		value = clean;
		const nextFocus = Math.min(clean.length, length - 1);
		inputs[nextFocus]?.focus();

		if (clean.length === length) {
			onComplete?.(clean);
		}
	}
</script>

<div class="flex items-center justify-center gap-2 sm:gap-2.5">
	{#each Array(length) as _, i}
		<input
			bind:this={inputs[i]}
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength={1}
			value={digits[i] || ""}
			{disabled}
			aria-label={`Digit ${i + 1}`}
			class={cn(
				"h-12 w-10 sm:h-13 sm:w-11 text-center font-mono text-xl font-bold rounded-lg border bg-white shadow-xs transition-all duration-150 outline-none select-none",
				"focus:border-slate-900 focus:ring-2 focus:ring-slate-950/10 focus:scale-[1.03]",
				digits[i] ? "border-slate-800 bg-slate-50/50 text-slate-950" : "border-slate-200 text-slate-900",
				error && "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/10",
				disabled && "opacity-50 cursor-not-allowed bg-slate-100"
			)}
			oninput={(e) => handleInput(i, e)}
			onkeydown={(e) => handleKeyDown(i, e)}
			onpaste={handlePaste}
			onfocus={(e) => (e.target as HTMLInputElement).select()}
		/>
	{/each}
</div>
