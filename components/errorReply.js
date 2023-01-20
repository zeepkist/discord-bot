export const errorReply = async (interaction, command, error) => {
    console.error(`An error occured processing the "${command}" command.\n\n${String(error)}`);
    console.log(error);
    await interaction.reply({
        ephemeral: true,
        content: 'An unexpected error occured while processing your request. Please try again later.'
    });
    setTimeout(() => interaction.deleteReply(), 15_000);
};
