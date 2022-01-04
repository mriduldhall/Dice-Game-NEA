import {Card, Typography, Chip, Avatar, TableCell, withStyles} from "@material-ui/core";


export const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);


export const PinkTextTypography = withStyles({
  root: {
    color: "#ff00ac",
  }
})(Typography);

export const BrownCard = withStyles({
  root: {
    backgroundColor: "#442424",
    padding: 10,
  }
})(Card);

export const NameChip = withStyles({
  root: {
    backgroundColor: "#4A3838BF",
    fontSize:22,
    color: "#f31a4c",
  }
})(Chip);

export const ScoreCounter = withStyles({
  root: {
    backgroundColor: "#000000",
  }
})(Avatar);

export const LeaderboardHeadingTableCell = withStyles({
  root: {
    fontSize:35,
    color:"#2e83f1",
  }
})(TableCell)

export const LeaderboardBlueTableCell = withStyles({
  root: {
    fontSize:17,
    color:"#2e83f1",
  }
})(TableCell)

export const LeaderboardWhiteTableCell = withStyles({
  root: {
    fontSize:17,
    color:"#ffffff",
  }
})(TableCell)
