
import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: '#174A84',
    },
}));

const ControlledCard = props => {
    const { title, summary, hideAllActions, hideExpandAction, hideButtonAction, avatarSrc, avatarText, onButtonClick } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root} variant="outlined">
            <CardHeader
                avatar={
                    <Avatar src={avatarSrc} aria-label="recipe" className={classes.avatar}>
                        {avatarText}
                    </Avatar>
                }
                style={{ textAlign: 'left', paddingBottom: 0}}
                title={title}
            />
            {!hideAllActions &&
                <CardActions disableSpacing>
                    
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                           {!hideExpandAction && <ExpandMoreIcon /> }
                        </IconButton>
                    {!hideButtonAction &&
                        <Button onClick={() => onButtonClick()} style={{ textTransform: 'capitalize' }} size="small" color="primary">
                            Learn More
                    </Button>
                    }
                </CardActions>
            }
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                       {summary}
          </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

ControlledCard.propTypes = {
    title: PropTypes.string,
    hideAllActions: PropTypes.bool,
    hideExpandAction: PropTypes.bool,
    hideButtonAction: PropTypes.bool,
    avatarSrc: PropTypes.any,
    avatarText: PropTypes.string,
    summary: PropTypes.string,
    onButtonClick: PropTypes.func,
};

ControlledCard.defaultProps = {
    title: "",
    hideAllActions: false,
    hideExpandAction: false,
    hideButtonAction: false,
    avatarSrc: null,
    avatarText: "",
    summary: "",
    onButtonClick: fn => fn
};

export default ControlledCard;