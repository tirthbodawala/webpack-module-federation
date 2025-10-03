import { Button, Container, Text, Title } from '@mantine/core';
import { Dots } from './dots';
import * as classes from './style.module.css';
import type { FC } from 'react';

export const Hero: FC<{ title: string, description: string }> = ({
  title,
  description,
}) => {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          {title}
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            {description}
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} size="lg" variant="default" color="gray">
            Connect
          </Button>
          <Button className={classes.control} size="lg">
            Purchase a license
          </Button>
        </div>
      </div>
    </Container>
  );
}