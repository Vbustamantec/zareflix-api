export class HfInference {
	textGeneration = jest.fn().mockResolvedValue({
		generated_text: `1. Movie One (2020)\n2. Movie Two (2021)\n3. Movie Three (2022)\n4. Movie Four (2023)\n5. Movie Five (2024)`,
	});

	textClassification = jest
		.fn()
		.mockResolvedValue([{ label: "4 stars", score: 0.9 }]);
}
